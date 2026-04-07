<?php
// restore-updraft.php
// WP must be loaded
require_once __DIR__ . '/wp-load.php';

if (!class_exists('UpdraftPlus')) {
    echo "UpdraftPlus not installed.\n";
    exit(1);
}

$updraft = new UpdraftPlus();

$backups = $updraft->get_existing_backups();
if (empty($backups)) {
    echo "No backups found.\n";
    exit(0);
}

$latest_backup = reset($backups); // Берём последний
echo "Restoring backup: " . $latest_backup['time'] . "\n";

$result = $updraft->restore_backup($latest_backup['id']);
if ($result === true) {
    echo "Restore completed successfully.\n";
} else {
    echo "Restore failed.\n";
}