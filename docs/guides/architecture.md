## Best Practices

### General Docker Best Practices

1. **Use specific version tags** instead of `latest` to ensure build reproducibility
2. **Minimize the number of layers** by combining related commands
3. **Don't install unnecessary packages** to reduce image size and attack surface
4. **Use multi-stage builds** to separate build dependencies from runtime dependencies
5. **Set appropriate health checks** to ensure proper container monitoring
6. **Docker Compose** use a compose.yml file without version specification

see [more detail on Docker usage](../../deploying/optimized-dockerfiles.md)

### Environment

* only 1 `.env` file in the project root

### Project Structure
- Adopt a clear layout:
```text
docs/
├── mkdocs.yml              # MkDocs Material config file
├── requirements.txt        # contains MkDocs plugin requirements
├── docs/                   # contains markdown files to power MkDocs site
│   ├── index.md
backend/                    # the FastAPI backend app
frontend/                   # the React frontend app
docker/                     # all docker files
├── Dockerfile.backend
├── Dockerfile.frontend
├── Dockerfile.docs
compose.yml
.env.example                # example environment variable file that outlines all variables for all services
.gitignore                  # autofill with appropriate excludes for FastAPI and React apps
README                      # descriptive markdown file with an overview of project and links to in depth docs in `/docs/docs/` folder
```