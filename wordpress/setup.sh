#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# First-run setup: install WordPress core + configure permalinks.
# Plugins, themes and backups are managed manually (WP admin / WP-CLI / GDrive).
# -----------------------------------------------------------------------------

# 1. Sync custom theme + mu-plugins from the image into the live site.
#    These paths exist only in the production image. In dev they are skipped,
#    because the theme/mu-plugins are bind-mounted from the host instead.
if [ -d /usr/src/wordpress/wp-content/themes/ragu ]; then
    echo "[INFO] Copying ragu theme from image..."
    mkdir -p /var/www/html/wp-content/themes
    cp -r /usr/src/wordpress/wp-content/themes/ragu /var/www/html/wp-content/themes/
fi

if [ -d /usr/src/wordpress/wp-content/mu-plugins ]; then
    echo "[INFO] Copying mu-plugins from image..."
    mkdir -p /var/www/html/wp-content/mu-plugins
    cp -r /usr/src/wordpress/wp-content/mu-plugins/. /var/www/html/wp-content/mu-plugins/
fi

# 2. Core install (only if not yet installed)
if ! wp core is-installed --allow-root 2>/dev/null; then
    echo "[INFO] Installing WordPress core..."
    wp core install \
        --url="${WORDPRESS_URL:-http://localhost}" \
        --title="Рагу" \
        --admin_user="${WORDPRESS_DB_USER:-admin}" \
        --admin_password="${WORDPRESS_DB_PASSWORD:-changeme}" \
        --admin_email="${WORDPRESS_ADMIN_EMAIL:-admin@example.com}" \
        --locale=ru_RU \
        --skip-email \
        --allow-root
fi

# 3. Pretty permalinks (required by WPGraphQL)
wp rewrite structure '/%postname%/' --allow-root

# 4. Permissions for Apache (www-data)
chown -R 33:33 /var/www/html

echo "[SUCCESS] WordPress core ready. Plugins and themes managed manually."
