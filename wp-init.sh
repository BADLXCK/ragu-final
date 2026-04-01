#!/bin/bash
set -e

echo "Waiting for WordPress container..."
until curl -s http://wordpress:80/wp-admin/install.php >/dev/null 2>&1; do sleep 3; done

echo "Setting DB env variables..."
export WORDPRESS_DB_HOST=${WORDPRESS_DB_HOST:-database:3306}
export WORDPRESS_DB_USER=${WORDPRESS_DB_USER:-admin}
export WORDPRESS_DB_PASSWORD=${WORDPRESS_DB_PASSWORD:-admin123}
export WORDPRESS_DB_NAME=${WORDPRESS_DB_NAME:-wordpress}

echo "Checking if WordPress is installed..."
if ! wp core is-installed --allow-root --path=/var/www/html; then
  echo "Installing WordPress..."
  wp core install \
    --url="http://localhost:8080" \
    --title="Docker WP" \
    --admin_user="admin" \
    --admin_password="admin123" \
    --admin_email="admin@example.com" \
    --skip-email \
    --allow-root \
    --path=/var/www/html
fi

echo "Activating theme ragu..."
wp theme activate ragu --allow-root --path=/var/www/html || true

echo "WP init complete!"