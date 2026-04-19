# WordPress Docker Image

Production-ready WordPress image for restaurant "Ragu" website.

## What's Inside

- **WordPress 6.9.4** with PHP 8.2
- **WP-CLI** — WordPress command line tool
- **Composer** — PHP dependency manager
- **rclone** — cloud storage sync (for backups)
- **MySQL client** — database utilities
- **Custom theme** — `ragu` theme pre-installed

## Entry Point

The container runs `wordpress/entrypoint.sh` on startup which:

1. Restores backups from Google Drive (if configured via `GDRIVE_*` env vars)
2. Runs `wordpress/setup.sh` which:
   - Installs WordPress with Russian locale
   - Activates `ragu` theme
   - Installs and configures plugins
   - Sets proper file permissions

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `WORDPRESS_DB_HOST` | Yes | MySQL host (e.g., `database:3306`) |
| `WORDPRESS_DB_USER` | Yes | MySQL username |
| `WORDPRESS_DB_PASSWORD` | Yes | MySQL password |
| `WORDPRESS_DB_NAME` | Yes | MySQL database name |
| `WORDPRESS_URL` | Yes | Public URL of the site (e.g., `https://restoranragu.ru`) |
| `WORDPRESS_ADMIN_EMAIL` | Yes | Admin email for WordPress |
| `GDRIVE_SERVICE_ACCOUNT_JSON` | No | Google Drive service account JSON for backup restore |
| `GDRIVE_BACKUP_FOLDER` | No | Google Drive folder ID for backups |

## Volumes

- `/var/www/html` — WordPress files (uploads, plugins, themes)

## Health Check

```bash
test: ["CMD", "test", "-f", "/tmp/wordpress-setup-complete"]
```

The health check passes after WordPress setup completes successfully.

## Build

```bash
docker build -f Dockerfile.wordpress -t ghcr.io/<owner>/ragu-wordpress:latest .
```

## Notes

- Image uses `wordpress:latest` as base
- Theme files are copied from `wordpress/themes/` during build
- Setup scripts are copied to `/usr/local/bin/` for execution on container start
