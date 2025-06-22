import os
from typing import AsyncGenerator
from sqlmodel import SQLModel, create_engine
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./app.db")

# Create async engine
if DATABASE_URL.startswith("sqlite"):
    # SQLite specific configuration
    engine: AsyncEngine = AsyncEngine(
        create_engine(
            DATABASE_URL,
            echo=True,
            future=True,
            poolclass=StaticPool,
            connect_args={"check_same_thread": False}
        )
    )
else:
    # PostgreSQL configuration
    engine: AsyncEngine = AsyncEngine(
        create_engine(
            DATABASE_URL,
            echo=True,
            future=True
        )
    )

# Create async session factory
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def init_db():
    """Initialize database tables"""
    async with engine.begin() as conn:
        # Import all models to ensure they are registered
        from app.models import User, Conversation, Message, AgentSession
        await conn.run_sync(SQLModel.metadata.create_all)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get database session"""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def close_db():
    """Close database connections"""
    await engine.dispose()