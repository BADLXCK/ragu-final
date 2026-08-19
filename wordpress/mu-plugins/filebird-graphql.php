<?php
/**
 * Plugin Name: FileBird → WPGraphQL
 * Description: Медиафайлы из папок FileBird через WPGraphQL.
 *
 *  - RootQuery.mediaByFolder(folderName|folderId, first, after) → MediaItem connection
 *  - RootQuery.mediaFolders → список папок (id, name, parent)
 *  - MediaItem.filebirdFolders → папки, в которых лежит файл
 *
 * Данные FileBird хранятся в таблицах:
 *  - {prefix}fbv                    — папки (id, name, parent)
 *  - {prefix}fbv_attachment_folder  — связь attachment_id ↔ folder_id
 */

defined( 'ABSPATH' ) || exit;

if ( ! defined( 'RAGU_FILEBIRD_GRAPHQL_LOADED' ) ) {
	define( 'RAGU_FILEBIRD_GRAPHQL_LOADED', true );

	add_action( 'graphql_register_types', 'ragu_filebird_register_graphql' );

	/**
	 * Проверяем наличие таблиц FileBird.
	 */
	function ragu_filebird_tables_exist() {
		global $wpdb;

		return $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->prefix . 'fbv' ) )
			&& $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $wpdb->prefix . 'fbv_attachment_folder' ) );
	}

	/**
	 * ID корневой папки + все вложенные (по parent).
	 *
	 * @param int $root_id ID корневой папки.
	 * @return int[]
	 */
	function ragu_filebird_collect_folder_ids( $root_id ) {
		global $wpdb;

		if ( ! ragu_filebird_tables_exist() || $root_id <= 0 ) {
			return array();
		}

		$rows         = $wpdb->get_results( "SELECT id, parent FROM {$wpdb->prefix}fbv", ARRAY_A );
		$children_map = array();

		foreach ( $rows as $row ) {
			$children_map[ (int) $row['parent'] ][] = (int) $row['id'];
		}

		$ids   = array();
		$stack = array( (int) $root_id );

		while ( $stack ) {
			$current = array_pop( $stack );

			if ( in_array( $current, $ids, true ) ) {
				continue;
			}

			$ids[] = $current;

			if ( isset( $children_map[ $current ] ) ) {
				foreach ( $children_map[ $current ] as $child_id ) {
					$stack[] = $child_id;
				}
			}
		}

		return $ids;
	}

	/**
	 * Резолвим ID папок по аргументам запроса.
	 *
	 * @param array $args Аргументы запроса (folderName|folderId в where).
	 * @return int[]
	 */
	function ragu_filebird_resolve_folder_ids( $args ) {
		global $wpdb;

		if ( ! ragu_filebird_tables_exist() ) {
			return array();
		}

		$filter = ! empty( $args['where'] ) && is_array( $args['where'] ) ? $args['where'] : $args;

		$root_id = 0;

		if ( ! empty( $filter['folderId'] ) ) {
			$root_id = (int) $filter['folderId'];
		} elseif ( ! empty( $filter['folderName'] ) ) {
			$root_id = (int) $wpdb->get_var(
				$wpdb->prepare(
					"SELECT id FROM {$wpdb->prefix}fbv WHERE name = %s LIMIT 1",
					sanitize_text_field( $filter['folderName'] )
				)
			);
		}

		if ( $root_id <= 0 ) {
			return array();
		}

		return ragu_filebird_collect_folder_ids( $root_id );
	}

	/**
	 * ID вложений, лежащих в указанных папках.
	 *
	 * @param array $args Аргументы запроса.
	 * @return int[]
	 */
	function ragu_filebird_resolve_attachment_ids( $args ) {
		global $wpdb;

		$filter     = ! empty( $args['where'] ) && is_array( $args['where'] ) ? $args['where'] : $args;
		$folder_ids = ragu_filebird_resolve_folder_ids( $filter );

		if ( empty( $folder_ids ) ) {
			return array();
		}

		$folder_in = implode( ',', array_map( 'intval', $folder_ids ) );

		return array_map(
			'intval',
			$wpdb->get_col(
				"SELECT DISTINCT attachment_id FROM {$wpdb->prefix}fbv_attachment_folder WHERE folder_id IN ({$folder_in})"
			)
		);
	}

	/**
	 * Регистрация GraphQL-схемы.
	 */
	function ragu_filebird_register_graphql() {
		register_graphql_object_type(
			'FileBirdFolder',
			array(
				'description' => __( 'Папка FileBird', 'ragu' ),
				'fields'      => array(
					'id'     => array( 'type' => 'Int' ),
					'name'   => array( 'type' => 'String' ),
					'parent' => array( 'type' => 'Int' ),
				),
			)
		);

		register_graphql_connection(
			array(
				'fromType'       => 'RootQuery',
				'toType'         => 'MediaItem',
				'fromFieldName'  => 'mediaByFolder',
				'description'    => __( 'Медиафайлы из папки FileBird (включая вложенные папки)', 'ragu' ),
				'connectionArgs' => array(
					'folderName' => array(
						'type'        => 'String',
						'description' => __( 'Название папки FileBird', 'ragu' ),
					),
					'folderId'   => array(
						'type'        => 'Int',
						'description' => __( 'ID папки FileBird', 'ragu' ),
					),
				),
				'resolve'        => function ( $source, $args, $context, $info ) {
					$resolver = new \WPGraphQL\Data\Connection\PostObjectConnectionResolver(
						$source,
						$args,
						$context,
						$info,
						'attachment'
					);

					$attachment_ids = ragu_filebird_resolve_attachment_ids( $args );

					if ( empty( $attachment_ids ) ) {
						$resolver->set_query_arg( 'post__in', array( 0 ) );
					} else {
						$resolver->set_query_arg( 'post__in', $attachment_ids );
						$resolver->set_query_arg( 'orderby', 'post__in' );
					}

					return $resolver->get_connection();
				},
			)
		);

		register_graphql_field(
			'RootQuery',
			'mediaFolders',
			array(
				'type'        => array( 'list_of' => 'FileBirdFolder' ),
				'description' => __( 'Список папок FileBird', 'ragu' ),
				'resolve'     => function () {
					global $wpdb;

					if ( ! ragu_filebird_tables_exist() ) {
						return array();
					}

					return $wpdb->get_results(
						"SELECT id, name, parent FROM {$wpdb->prefix}fbv ORDER BY parent ASC, ord ASC"
					);
				},
			)
		);

		register_graphql_field(
			'MediaItem',
			'filebirdFolders',
			array(
				'type'        => array( 'list_of' => 'FileBirdFolder' ),
				'description' => __( 'Папки FileBird, в которых находится файл', 'ragu' ),
				'resolve'     => function ( $media_item ) {
					global $wpdb;

					if ( ! ragu_filebird_tables_exist() ) {
						return array();
					}

					$post_id = isset( $media_item->databaseId ) ? (int) $media_item->databaseId : 0;

					if ( ! $post_id ) {
						return array();
					}

					return $wpdb->get_results(
						$wpdb->prepare(
							"SELECT fbv.id, fbv.name, fbv.parent
							FROM {$wpdb->prefix}fbv_attachment_folder AS rel
							INNER JOIN {$wpdb->prefix}fbv AS fbv ON fbv.id = rel.folder_id
							WHERE rel.attachment_id = %d
							ORDER BY fbv.parent ASC, fbv.ord ASC",
							$post_id
						)
					);
				},
			)
		);
	}
}
