"""
HIPAA-compliant security measures for RadiantCompass Patient Journey Platform
Implements encryption, audit logging, access controls, and data protection
"""

import hashlib
import secrets
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from cryptography.fernet import Fernet
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import logging
import json
import os
from sqlalchemy.ext.asyncio import AsyncSession

# Security configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# PHI encryption key (should be stored securely in production)
ENCRYPTION_KEY = os.getenv("PHI_ENCRYPTION_KEY", Fernet.generate_key().decode())
cipher_suite = Fernet(ENCRYPTION_KEY.encode() if isinstance(ENCRYPTION_KEY, str) else ENCRYPTION_KEY)

# Security bearer
security = HTTPBearer()

# Audit logger
audit_logger = logging.getLogger("hipaa_audit")
audit_handler = logging.FileHandler("hipaa_audit.log")
audit_formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
audit_handler.setFormatter(audit_formatter)
audit_logger.addHandler(audit_handler)
audit_logger.setLevel(logging.INFO)

class HIPAASecurityManager:
    """HIPAA-compliant security manager for patient health information"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def encrypt_phi(data: str) -> str:
        """Encrypt Protected Health Information (PHI)"""
        if not data:
            return data
        return cipher_suite.encrypt(data.encode()).decode()
    
    @staticmethod
    def decrypt_phi(encrypted_data: str) -> str:
        """Decrypt Protected Health Information (PHI)"""
        if not encrypted_data:
            return encrypted_data
        try:
            return cipher_suite.decrypt(encrypted_data.encode()).decode()
        except Exception:
            return encrypted_data  # Return as-is if not encrypted
    
    @staticmethod
    def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def create_refresh_token(data: Dict[str, Any]) -> str:
        """Create JWT refresh token"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Dict[str, Any]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    @staticmethod
    def mask_email(email: str) -> str:
        """Mask email for logging/display"""
        if not email or "@" not in email:
            return "***MASKED***"
        local, domain = email.split("@", 1)
        if len(local) <= 2:
            return f"***@{domain}"
        return f"{local[:2]}***@{domain}"
    
    @staticmethod
    async def log_audit_event(
        session: AsyncSession,
        user_id: Optional[int],
        action: str,
        resource: str,
        resource_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        status: str = "success",
        details: Optional[Dict[str, Any]] = None
    ):
        """Log HIPAA audit event"""
        # Import AuditLog here to avoid circular imports
        from app.models import AuditLog
        
        audit_log = AuditLog(
            user_id=user_id,
            action=action,
            resource=resource,
            resource_id=resource_id,
            ip_address=ip_address,
            user_agent=user_agent,
            status=status,
            details=details or {},
            timestamp=datetime.utcnow()
        )
        
        session.add(audit_log)
        await session.commit()
        
        # Also log to file for external audit systems
        audit_logger.info(
            f"User:{user_id} Action:{action} Resource:{resource} "
            f"ResourceId:{resource_id} IP:{ip_address} Status:{status}"
        )

class AccessControl:
    """Role-based access control for HIPAA compliance"""
    
    ROLES = {
        "patient": ["read_own_data", "update_own_data"],
        "caregiver": ["read_patient_data", "update_patient_data"],
        "provider": ["read_patient_data", "update_patient_data", "create_treatment_plan"],
        "admin": ["read_all_data", "update_all_data", "manage_users", "view_audit_logs"]
    }
    
    @staticmethod
    def check_permission(user_role: str, required_permission: str) -> bool:
        """Check if user role has required permission"""
        return required_permission in AccessControl.ROLES.get(user_role, [])
    
    @staticmethod
    def can_access_patient_data(user_role: str, user_id: int, patient_id: int) -> bool:
        """Check if user can access specific patient data"""
        if user_role == "admin":
            return True
        if user_role == "patient" and user_id == patient_id:
            return True
        if user_role in ["caregiver", "provider"]:
            # In production, check care team relationships
            return True
        return False

# These dependency functions will be defined in main.py to avoid circular imports
# They are provided here as templates but should be implemented where models are imported

def get_client_ip(request: Request) -> str:
    """Extract client IP address from request"""
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    return request.client.host if request.client else "unknown"

def sanitize_phi_log(data: Dict[str, Any]) -> Dict[str, Any]:
    """Remove or mask PHI from log data"""
    phi_fields = [
        "email", "phone", "address", "ssn", "medical_record_number",
        "date_of_birth", "full_name", "first_name", "last_name"
    ]
    
    sanitized = data.copy()
    for field in phi_fields:
        if field in sanitized:
            if isinstance(sanitized[field], str) and len(sanitized[field]) > 0:
                sanitized[field] = "***MASKED***"
            else:
                sanitized[field] = "***MASKED***"
    
    return sanitized

class DataProtection:
    """Data protection utilities for HIPAA compliance"""
    
    @staticmethod
    def mask_email(email: str) -> str:
        """Mask email for logging/display"""
        if not email or "@" not in email:
            return "***MASKED***"
        local, domain = email.split("@", 1)
        if len(local) <= 2:
            return f"***@{domain}"
        return f"{local[:2]}***@{domain}"
    
    @staticmethod
    def mask_phone(phone: str) -> str:
        """Mask phone number for logging/display"""
        if not phone:
            return "***MASKED***"
        if len(phone) >= 4:
            return f"***-***-{phone[-4:]}"
        return "***MASKED***"
    
    @staticmethod
    def generate_patient_id() -> str:
        """Generate secure patient identifier"""
        return f"PT-{secrets.token_hex(8).upper()}"
    
    @staticmethod
    def hash_identifier(identifier: str) -> str:
        """Create one-way hash of identifier for matching"""
        return hashlib.sha256(identifier.encode()).hexdigest()

# Security middleware
class HIPAASecurityMiddleware:
    """HIPAA security middleware for request/response processing"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            # Add security headers
            async def send_wrapper(message):
                if message["type"] == "http.response.start":
                    headers = dict(message.get("headers", []))
                    
                    # HIPAA security headers
                    security_headers = {
                        b"x-content-type-options": b"nosniff",
                        b"x-frame-options": b"DENY",
                        b"x-xss-protection": b"1; mode=block",
                        b"strict-transport-security": b"max-age=31536000; includeSubDomains",
                        b"referrer-policy": b"strict-origin-when-cross-origin",
                        b"cache-control": b"no-cache, no-store, must-revalidate, private",
                        b"pragma": b"no-cache",
                        b"expires": b"0"
                    }
                    
                    headers.update(security_headers)
                    message["headers"] = list(headers.items())
                
                await send(message)
            
            await self.app(scope, receive, send_wrapper)
        else:
            await self.app(scope, receive, send)

# Session management
class SessionManager:
    """Secure session management for HIPAA compliance"""
    
    @staticmethod
    def create_session_token() -> str:
        """Create secure session token"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def is_session_expired(session_start: datetime, max_inactive_minutes: int = 30) -> bool:
        """Check if session has expired"""
        return datetime.utcnow() - session_start > timedelta(minutes=max_inactive_minutes)
    
    @staticmethod
    def invalidate_session(session_token: str):
        """Invalidate session token (implement with cache/database)"""
        # In production, maintain session blacklist in Redis or database
        pass