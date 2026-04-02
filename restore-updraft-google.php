<?php

if (!defined('ABSPATH')) {
    exit("Run via WP-CLI only\n");
}

echo "Waiting UpdraftPlus bootstrap...\n";

if (!class_exists('UpdraftPlus')) {
    exit("UpdraftPlus not loaded\n");
}

$folder = getenv('UPDRAFT_GOOGLE_FOLDER') ?: 'UpdraftPlus';
$token  = getenv('UPDRAFT_GOOGLE_REFRESH_TOKEN');

if (!$token) {
    exit("No Google token\n");
}

$updraft = UpdraftPlus::get_instance();

echo "Connecting Google Drive...\n";

/*
 * IMPORTANT:
 * force immediate restore instead of cron scheduling
 */
$updraft->backupnow_initiate(
    'restore',
    array(
        'components' => array('db','plugins','themes','uploads','others')
    )
);

echo "Restore started synchronously\n";