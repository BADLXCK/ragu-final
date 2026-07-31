#!/bin/bash
set -e

# -----------------------------------------------------------------------------
# Minimal WordPress setup: theme + plugins are baked into the image at build
# time (see Dockerfile.wordpress). This script only activates them via WP-CLI
# once the database is available.
# -----------------------------------------------------------------------------

# Core install (if not yet installed)
if ! wp core is-installed --allow-root 2>/dev/null; then
    echo "[INFO] Installing WordPress..."
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

# Sync baked content from the image into the live site
mkdir -p /var/www/html/wp-content/themes /var/www/html/wp-content/plugins /var/www/html/wp-content/mu-plugins
cp -r /usr/src/wordpress/wp-content/themes/ragu /var/www/html/wp-content/themes/
cp -r /usr/src/wordpress/wp-content/plugins/. /var/www/html/wp-content/plugins/
cp -r /usr/src/wordpress/wp-content/mu-plugins/. /var/www/html/wp-content/mu-plugins/

# Theme
echo "[INFO] Activating theme ragu..."
wp theme activate ragu --allow-root

# Remove default themes
echo "[INFO] Removing default themes..."
wp theme list --field=name --allow-root | grep '^twenty' | xargs -r wp theme delete --allow-root

# Permalinks (required by WPGraphQL)
wp rewrite structure '/%postname%/' --allow-root

# Plugins (baked into the image at build time)
PLUGINS=(woocommerce advanced-custom-fields autodescription filebird updraftplus organize-media-folder pods wp-graphql wpgql-woo)
echo "[INFO] Activating plugins: ${PLUGINS[*]}"
for p in "${PLUGINS[@]}"; do
    wp plugin activate "$p" --allow-root
done

# WPGraphQL public introspection (required by frontend codegen)
wp option update graphql_general_settings '{"public_introspection_enabled":"on"}' --format=json --allow-root || true

# Permissions for Apache (www-data)
chown -R 33:33 /var/www/html

echo "[SUCCESS] Setup completed"
