<?php

require_once __DIR__ . '/wp-load.php';

if (!class_exists('UpdraftPlus')) {
    echo "UpdraftPlus not loaded yet\n";
    return;
}

/*
 * НЕ запускаем restore напрямую.
 * Только ставим задачу в очередь WordPress.
 */

update_option('updraft_restore_triggered', time());

do_action('updraftplus_restore', [
    'backup_set' => 'latest',
    'components' => ['db','plugins','themes','uploads','others']
]);

echo "Restore scheduled via WP Cron\n";