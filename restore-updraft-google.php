<?php
define('WP_USE_THEMES', false);
require_once __DIR__ . '/wp-load.php';

if (!is_plugin_active('updraftplus/updraftplus.php')) {
    activate_plugin('updraftplus/updraftplus.php');
}

$folder = getenv('UPDRAFT_GOOGLE_FOLDER') ?: 'UpdraftPlus';
$token = getenv('UPDRAFT_GOOGLE_REFRESH_TOKEN');

if (!$token) exit("No Google refresh token provided\n");

echo "Restoring backup from Google Drive...\n";

if (class_exists('UpdraftPlus')) {
    $updraft = UpdraftPlus::get_instance();
    $updraft->restore_from_google_drive($folder, $token);
} else {
    exit("UpdraftPlus class not found\n");
}