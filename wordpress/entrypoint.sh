#!/bin/bash
set -e

# Wait for the database
echo "[INFO] Waiting for database at $WORDPRESS_DB_HOST..."
until mysql -h "$WORDPRESS_DB_HOST" -u "$WORDPRESS_DB_USER" -p"$WORDPRESS_DB_PASSWORD" --skip-ssl -e "SELECT 1;" >/dev/null 2>&1; do
    echo "[INFO] Waiting for database..."
    sleep 3
done

# Run the official entrypoint (creates wp-config.php, copies files, starts Apache)
/usr/local/bin/docker-entrypoint.sh "$@" &
OFFICIAL_PID=$!

# Wait for WordPress files to be ready
until [ -f /var/www/html/wp-config.php ] && [ -d /var/www/html/wp-content/plugins ]; do
    sleep 1
done

# Run our setup (theme, plugins) once after the files are ready
if [ ! -f /tmp/wordpress-setup-complete ]; then
    /usr/local/bin/setup-wordpress.sh
    touch /tmp/wordpress-setup-complete
fi

wait $OFFICIAL_PID
