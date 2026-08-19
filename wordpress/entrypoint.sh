#!/bin/bash
set -e

# 1. Wait for MySQL to be ready
echo "[INFO] Waiting for database at $WORDPRESS_DB_HOST..."
until mysql -h "$WORDPRESS_DB_HOST" -u "$WORDPRESS_DB_USER" -p"$WORDPRESS_DB_PASSWORD" --skip-ssl -e "SELECT 1;" >/dev/null 2>&1; do
    echo "[INFO] Database not ready, retrying..."
    sleep 3
done

# 2. Run the official WordPress entrypoint (creates wp-config.php, copies core)
/usr/local/bin/docker-entrypoint.sh "$@" &
OFFICIAL_PID=$!

# 3. Wait for WordPress files to be ready
until [ -f /var/www/html/wp-config.php ]; do
    sleep 1
done

# 4. First-run setup: core install + permalinks only.
#    Plugins/themes/backups are managed manually by the developer.
if [ ! -f /tmp/wordpress-setup-complete ]; then
    /usr/local/bin/setup-wordpress.sh
    touch /tmp/wordpress-setup-complete
fi

wait $OFFICIAL_PID
