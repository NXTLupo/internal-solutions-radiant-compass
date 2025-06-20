<!-- FastAPI + SQLModel + Alembic Production Style Guide: Injection Snippet -->

<!-- DEPENDENCIES & PACKAGE MANAGEMENT -->
## Dependencies & Package Management
- Use **Poetry** (or **UV**) to manage dependencies and lock versions (`poetry.lock` / `uv.lock`).
- Key dependencies:
  ```text
    python = "^3.9"
    fastapi = "0.115.12"
    uvicorn = {extras = ["standard"], version = "^0.34.2"}
    pydantic = "2.11.3"
    pydantic-settings = "2.9.1"
    httpx = "^0.28.1"
    python-dotenv = "^1.1.0"
    sqlmodel = "^0.0.24"
    alembic = "^1.15.2"
    asyncpg = "^0.30.0"
  ```
- Orchestrate services with **docker-compose** for reproducible local environments

<!-- PROJECT STRUCTURE -->
## Project Structure
- Adopt a clear layout:
```text
backend/
├── alembic.ini
├── migrations/
├── app/
│   ├── main.py
│   ├── db.py
│   └── models.py
└── README.md
```
- Use minimal logic in `app/main.py`, delegating DB sessions, models, and routes to separate modules

<!-- DATABASE MODELS -->

## Database Models (SQLModel)
- Define tables with SQLModel in `app/models.py`:
  ```python
  from typing import Optional
  from sqlmodel import SQLModel, Field

  class Song(SQLModel, table=True):
      id: Optional[int] = Field(default=None, primary_key=True)
      name: str
      artist: str
  
  class SongCreate(SQLModel):
      name: str
      artist: str
  ```
- Keep DTOs (e.g., `SongCreate`) alongside table models to leverage Pydantic validation

<!-- ASYNC SETUP -->
## Asynchronous Database Setup
- Use `AsyncEngine` and `AsyncSession` for non-blocking I/O:
  ```python
  import os
  from sqlmodel import SQLModel, create_engine
  from sqlmodel.ext.asyncio.session import AsyncSession, AsyncEngine
  from sqlalchemy.orm import sessionmaker

  DATABASE_URL = os.environ["DATABASE_URL"]
  engine: AsyncEngine = AsyncEngine(
      create_engine(DATABASE_URL, echo=True, future=True)
  )

  async def init_db():
      async with engine.begin() as conn:
          await conn.run_sync(SQLModel.metadata.create_all)

  async def get_session() -> AsyncSession:
      async_session = sessionmaker(
          engine, class_=AsyncSession, expire_on_commit=False
      )
      async with async_session() as session:
          yield session
  ```
- Convert `on_startup` event to async and call `await init_db()`

<!-- ROUTES & DEPENDENCIES -->
## API Routes & Dependency Injection
- Inject `AsyncSession` via `Depends(get_session)` in route handlers:
  ```python
  from fastapi import FastAPI, Depends
  from sqlmodel import select
  from app.db import get_session, init_db
  from app.models import Song, SongCreate

  app = FastAPI()

  @app.on_event("startup")
  async def on_startup():
      await init_db()

  @app.get("/songs", response_model=list[Song])
  async def list_songs(session: AsyncSession = Depends(get_session)):
      result = await session.execute(select(Song))
      return result.scalars().all()

  @app.post("/songs", response_model=Song)
  async def create_song(
      song: SongCreate,
      session: AsyncSession = Depends(get_session)
  ):
      db_song = Song.from_orm(song)
      session.add(db_song)
      await session.commit()
      await session.refresh(db_song)
      return db_song
  ```
- Keep route definitions minimal and leverage Pydantic models for serialization

<!-- MIGRATIONS -->
## Migrations (Alembic)
- Initialize Alembic with async template:
  ```bash
  docker-compose exec web alembic init -t async migrations
  ```
- Update `script.py.mako` to import `sqlmodel`:
  ```mako
  import sqlmodel  # NEW
  ```
- Configure `alembic/env.py`:
  ```python
  from sqlmodel import SQLModel
  from app.models import Song  # ensure model import
  target_metadata = SQLModel.metadata
  ```
- Set `sqlalchemy.url` in `alembic.ini` to your async DB URL
- Generate and apply migrations:
  ```bash
  docker-compose exec web alembic revision --autogenerate -m "init"
  docker-compose exec web alembic upgrade head
  ```
- For schema changes, edit models, then repeat `alembic revision --autogenerate`

<!-- USAGE TIPS FOR AI ASSISTANTS -->
## Usage Tips for AI Assistants
- Use directive comments (`<!-- ... -->`) to scope rule application.
- Scaffold files and modules matching the above structure.
- Auto-generate migrations and sessions using the patterns here.
- Prioritize `AsyncSession` and minimal `main.py` logic for clarity.