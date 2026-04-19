# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Restaurant "Ragu" website built with Next.js 15 (App Router) using WordPress as a Headless CMS. The frontend fetches data via GraphQL from WordPress/WooCommerce, which manages menu items, events, galleries, and other content.

## Development Commands

### Initial Setup
```bash
npm install
cp .env.example .env  # Configure environment variables
npm run docker:up     # Starts db, wordpress, frontend, and runs wpcli setup
```

### Development Workflow
```bash
npm run dev           # Start Next.js dev server (runs codegen first)
npm run build         # Production build (runs codegen first)
npm run lint          # ESLint check
npm run codegen       # Regenerate GraphQL types from WordPress schema
```

### Docker Management
```bash
npm run docker:up              # Start all containers (db, wordpress, frontend, wpcli)
npm run docker:down            # Stop all containers
npm run docker:restart         # Restart all containers
npm run docker:wpcli:rebuild   # Rebuild wpcli container after wp-init.sh changes
```

### Code Analysis
```bash
npm run find-deadcode  # Find unused exports with ts-prune
npm run knip           # Check for unused dependencies
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript 5.9, SCSS Modules
- **CMS**: WordPress 6.9.4 with WPGraphQL, WooCommerce, ACF Pro
- **Data Layer**: GraphQL via graphql-request, auto-generated types via GraphQL Codegen
- **Infrastructure**: Docker Compose (dev), Traefik + Docker (production)

### Key Directories
- `src/app/` - Next.js pages (menu, banquet, gallery, contacts, reviews, reserve, afisha)
- `src/api/` - GraphQL client and queries
- `src/api/gql/` - Auto-generated TypeScript types from WordPress GraphQL schema
- `src/components/` - Reusable React components
- `src/layouts/` - Layout components (RootLayout)
- `wp-content/themes/ragu/` - Custom WordPress theme
- `wp-init.sh` - WordPress initialization script (installs plugins, configures WP)

### GraphQL Data Flow
1. WordPress exposes GraphQL API via WPGraphQL plugin at `/graphql`
2. `codegen.ts` fetches schema from `SCHEMA_URL` and generates types in `src/api/gql/`
3. `add-ts-nocheck.js` adds `// @ts-nocheck` to `src/api/gql/gql.ts` (post-codegen)
4. Queries in `src/api/queries/` use generated types for type-safe data fetching
5. GraphQL client (`src/api/client.ts`) uses `graphql-request` library

### WordPress Setup
The `wp-init.sh` script (runs via wpcli container) automatically:
- Installs WordPress with Russian locale
- Activates custom "ragu" theme
- Installs and activates plugins: WooCommerce, ACF, WPGraphQL, wp-graphql-woocommerce, Yoast SEO, FileBird, UpdraftPlus, Pods
- Disables WooCommerce Legacy REST API (GraphQL only)
- Sets proper file permissions for www-data (UID 33)

### Environment Variables
Key variables in `.env`:
- `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD` - MySQL credentials
- `WORDPRESS_URL` - WordPress admin URL (e.g., `http://localhost:8080`)
- `SCHEMA_URL` - GraphQL endpoint for codegen (e.g., `http://localhost:8080/graphql`)
- `DOMAIN` - Production domain (e.g., `restoranragu.ru`)
- `GDRIVE_SERVICE_ACCOUNT_JSON` - (Optional) Google Drive service account JSON for backup restore
- `GDRIVE_BACKUP_FOLDER` - (Optional) Google Drive folder ID (from URL after `/folders/`)

### Backup Restore from Google Drive
WordPress setup script can automatically restore backups from Google Drive on first installation:
1. Create a service account in Google Cloud Console
2. Download JSON key and minify to single line: `cat key.json | jq -c`
3. Add to `.env` as `GDRIVE_SERVICE_ACCOUNT_JSON`
4. Get folder ID from Google Drive URL: `https://drive.google.com/drive/folders/FOLDER_ID`
5. Share folder with service account email (from JSON `client_email` field) with Viewer access
6. Set `GDRIVE_BACKUP_FOLDER=FOLDER_ID` in `.env`
7. Backup files must match patterns: `backup-*-uploads-*.zip` (uploads) and `backup-*-db*.gz` (database)
8. On first `docker-compose up`, backups are downloaded and restored automatically
9. If variables are not set, backup restore is skipped

### Docker Architecture
**Development**: 
- Frontend (port 3000), WordPress (port 8080), MySQL (internal), wpcli (one-time setup)
- Frontend container mounts source code for hot reload

**Production**: 
- Traefik reverse proxy handles SSL and routing
- Frontend at `${DOMAIN}`, WordPress admin at `wp.${DOMAIN}`
- Database not exposed externally

## Important Patterns

### GraphQL Type Generation
After any WordPress schema changes (new fields, post types, etc.):
1. Ensure WPGraphQL Public Introspection is enabled in WordPress admin
2. Run `npm run codegen` to regenerate types
3. The build/dev commands automatically run codegen, but manual runs may be needed

### Menu Structure
- `/menu` redirects to `/menu/zakuski` (see `next.config.ts`)
- Menu items are WooCommerce products organized by categories
- Dynamic routes: `/menu/[category]` for category pages

### Image Handling
Next.js Image component configured to allow images from `wordpress` hostname (Docker internal networking). See `next.config.ts` remotePatterns.

### Styling
- SCSS Modules with `.module.scss` extension
- Global variables in `src/app/styles/_variables.scss`
- Mixins in `src/app/styles/_mixins.scss`
- Global reset in `src/app/styles/reset.css`

## Common Tasks

### Adding a New GraphQL Query
1. Create query file in `src/api/queries/`
2. Import types from `src/api/gql/graphql`
3. Use `gql` tag from `graphql-request`
4. Call `client.request(query)` from `src/api/client.ts`

### Modifying WordPress Setup
1. Edit `wp-init.sh` to add/remove plugins or change configuration
2. Rebuild wpcli container: `npm run docker:wpcli:rebuild`
3. Restart containers: `npm run docker:restart`

### Testing WordPress Changes Locally
1. Access WordPress admin at `http://localhost:8080`
2. Default credentials: username and password from `.env` (`DATABASE_USER`/`DATABASE_PASSWORD`)
3. Make changes in WordPress admin
4. Run `npm run codegen` if schema changed
5. Frontend at `http://localhost:3000` will reflect changes

## Notes

- The project uses Russian language for WordPress and content
- WPGraphQL Public Introspection must be manually enabled in WordPress settings for codegen to work
- The `add-ts-nocheck.js` script is necessary because generated GraphQL types may have TypeScript errors
- WooCommerce products represent restaurant menu items (not e-commerce)
- Production uses Traefik for automatic SSL via Let's Encrypt

**When starting work on a Next.js project, ALWAYS call the `init` tool from
next-devtools-mcp FIRST to set up proper context and establish documentation
requirements. Do this automatically without being asked.**