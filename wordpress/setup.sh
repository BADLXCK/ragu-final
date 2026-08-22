#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# First-run setup: install WordPress core + plugins via WP-CLI + permalinks.
# Plugins are downloaded at runtime (not baked into the image).
# Themes and backups are managed manually (WP admin / WP-CLI / GDrive).
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

# 3. Install + activate plugins via WP-CLI (from wordpress.org)
echo "[INFO] Installing plugins via WP-CLI..."
wp plugin install \
    woocommerce \
    advanced-custom-fields \
    autodescription \
    filebird \
    updraftplus \
    organize-media-folder \
    pods \
    wp-graphql \
    --activate \
    --allow-root \
    || echo "[WARN] Some plugins failed to install"

# 3b. wp-graphql-woocommerce — not on wordpress.org, install from GitHub release
WPGQL_WOO_URL="https://github.com/wp-graphql/wp-graphql-woocommerce/releases/download/v1.0.3/wp-graphql-woocommerce.zip"
if ! wp plugin is-installed wp-graphql-woocommerce --allow-root 2>/dev/null; then
    echo "[INFO] Installing wp-graphql-woocommerce from GitHub..."
    wp plugin install "$WPGQL_WOO_URL" --activate --allow-root \
        || echo "[WARN] Failed to install wp-graphql-woocommerce"
else
    wp plugin activate wp-graphql-woocommerce --allow-root \
        || echo "[WARN] Failed to activate wp-graphql-woocommerce"
fi

# 4. Pretty permalinks (required by WPGraphQL)
wp rewrite structure '/%postname%/' --allow-root

# 5. Permissions for Apache (www-data)
chown -R 33:33 /var/www/html

echo "[SUCCESS] WordPress ready. Plugins installed and activated via WP-CLI."
