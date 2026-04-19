#!/bin/bash

# Copy plugin and theme from staging to WordPress (after volume is mounted)
copy_custom_files() {
    # Wait for WordPress files to be ready
    while [ ! -d /var/www/html/wp-content/plugins ]; do
        sleep 2
    done

    # Copy theme if not already present
    if [ ! -d /var/www/html/wp-content/themes/ragu ]; then
        echo "Installing ragu theme..."
        cp -r /usr/src/ragu /var/www/html/wp-content/themes/
        chown -R www-data:www-data /var/www/html/wp-content/themes/ragu
    fi

    # Create robots.txt to block all crawlers (Next.js is the public site)
    echo "Creating robots.txt..."
    cat > /var/www/html/robots.txt << 'EOF'
User-agent: *
Disallow: /
EOF
    chown www-data:www-data /var/www/html/robots.txt

    # Run the setup script
    /usr/local/bin/setup-wordpress.sh
}

# Run copy and setup in background after a delay
(sleep 10 && copy_custom_files) &

# Run the original WordPress entrypoint
exec docker-entrypoint.sh "$@"