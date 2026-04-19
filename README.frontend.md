# Frontend Docker Image

Production-ready Next.js frontend image for restaurant "Ragu" website.

## What's Inside

- **Node.js 22** (Alpine Linux)
- **Multi-stage build** for minimal image size
- **Standalone output** — self-contained Node.js server

## Build Stages

1. **deps** — install npm dependencies
2. **builder** — run `npm run docker:build` (skips codegen)
3. **runner** — production image with built artifacts

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | Yes | Public URL of the site (e.g., `https://restoranragu.ru`) |
| `NEXT_PUBLIC_WORDPRESS_API_URL` | Yes | WordPress internal URL (e.g., `http://wordpress`) |
| `NEXT_PUBLIC_WORDPRESS_API_HOSTNAME` | Yes | WordPress hostname for API (e.g., `wordpress`) |
| `SCHEMA_URL` | Yes | GraphQL endpoint URL (e.g., `http://wordpress/graphql`) |

## Ports

- **3000** — HTTP server

## Build

```bash
# Build the image
docker build -f Dockerfile.frontend -t ghcr.io/<owner>/ragu-frontend:latest .

# Note: The Docker build uses 'npm run docker:build' which skips codegen
# Codegen types must be pre-generated and committed to the repository
```

## Notes

- Image uses multi-stage build to minimize size
- Runs as non-root user `nextjs` for security
- Static assets and Next.js cache are preserved
- Uses Next.js standalone mode for easy deployment
