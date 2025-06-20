<!-- Python Production Style Guide: Injection Snippet -->

<!-- PACKAGE MANAGEMENT -->
## Package Management
- Use a single, fast package manager: prefer **Poetry** or **uv** for dependency resolution, virtual env handling, and migration from other managers.
- Lock all dependencies: commit `poetry.lock` or `uv.lock` to guarantee reproducible installs.
- **Example**:
  ```bash
  # Sync/update all groups
  uv sync --all-groups
  ```

<!-- LINTING & FORMATTING -->
## Linters & Formatting
- Chain linters for maximum coverage:
  - `autoflake` (remove unused imports/vars)
  - `autopep8` (PEP8 fixes)
  - `ruff` (fast lint + auto-fix)
  - `isort` (import sorting)
  - `pylint` (deep static analysis)
- Enforce via Git hooks: use **pre-commit** to run formatting and lint checks before commits.
- **Sample Make targets**:
  ```makefile
  format:
      uv run autoflake --in-place -r --remove-all-unused-imports .
      uv run autopep8 --recursive --in-place .
      uv run ruff check --fix
      uv run isort --line-length 88

  lint:
      uv run flake8 . --max-line-length=88 --ignore=W503
      uv run pylint --rcfile=.pylintrc --output-format=colorized
  ```

<!-- SECURITY -->
## Secrets & Compliance
- Prevent secret leaks

<!-- MAINTAINABILITY -->
## Project Structure & Maintainability
- Web services: use **FastAPI** + **Gunicorn** for high throughput (~3x Flask/Gunicorn).
- Data models: prefer `@dataclasses.dataclass` or **Pydantic** models to define schema + validation.
- Avoid Python threads: the GIL makes multithreading fragile - use processes or async instead.
- Dependency auditing:
  - **Dependabot** for weekly updates
  ```yaml
  # .github/dependabot.yml
  version: 2
  updates:
    - package-ecosystem: pip
      directory: "/"
      schedule:
        interval: weekly
  ```

<!-- DEPLOYMENT -->
## Deployment Best Practices
- Docker multi-stage: build with Poetry/uv, then copy artifacts into `python:3.X-slim` - avoid Alpine for musl/glibc issues.
  ```dockerfile
  # builder
  FROM python:3.X AS builder
  RUN pip install poetry
  COPY pyproject.toml poetry.lock ./
  RUN poetry export -f requirements.txt > reqs.txt \
      && pip install --no-cache-dir -r reqs.txt

  # runtime
  FROM python:3.X-slim
  COPY --from=builder /usr/local/lib/python3.X /usr/local/lib/python3.X
  ```
- Compile on build: pre-compile `.pyc` for faster cold starts:
  ```dockerfile
  RUN python -m compileall /app
  ```
- Offline data: download large models (spaCy, Transformers) at build time and set:
  ```dockerfile
  ENV TRANSFORMERS_OFFLINE=1 HF_HUB_OFFLINE=1
  ```
- Non-root user: reduce container attack surface:
  ```dockerfile
  RUN groupadd -r appuser && useradd -r -g appuser appuser
  USER appuser
  ```
- GPU vs CPU builds:
  - GPU: `docker run --gpus all ...`
  - CPU-only PyTorch:
    ```bash
    pip install torch --index-url https://download.pytorch.org/whl/cpu
    ```

<!-- USAGE TIPS FOR AI ASSISTANTS -->
## Usage Tips for AI Assistants
- Match the snippet’s directive comments (`<!-- ... -->`) to trigger relevant rules.
- Emit code following these patterns when scaffolding or refactoring.
- Keep examples minimal and aligned with production defaults.