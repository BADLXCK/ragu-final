<?php
/**
 * SEO REST API — The SEO Framework to Next.js Metadata bridge
 */

add_action( 'rest_api_init', function () {
	add_filter( 'the_seo_framework_use_the_archive_title_prefix', '__return_false' );
	add_filter( 'get_the_archive_title_prefix', '__return_empty_string' );

	register_rest_route( 'seo/v1', '/page', [
		'methods'             => 'GET',
		'callback'            => 'seo_rest_get_by_uri',
		'permission_callback' => '__return_true',
		'args'                => [ 'uri' => [ 'required' => true ] ],
	] );

	register_rest_route( 'seo/v1', '/global', [
		'methods'             => 'GET',
		'callback'            => 'seo_rest_get_global',
		'permission_callback' => '__return_true',
	] );
} );

function seo_rest_clean_title( $title ) {
	return preg_replace( '/^(Category|Архив|Категория|Tag|Метка|Products|Товары):\s+/iu', '', $title );
}

/**
 * Parses TSF robots string into Next.js robots object
 */
function seo_rest_parse_robots( $robots_str ) {
	if ( ! $robots_str ) return null;
	return [
		'index'  => ! str_contains( $robots_str, 'noindex' ),
		'follow' => ! str_contains( $robots_str, 'nofollow' ),
	];
}

/**
 * Main data extractor — returns Next.js Metadata compatible structure
 */
function seo_rest_get_metadata_object( $args ) {
	if ( ! function_exists( 'the_seo_framework' ) ) return [];
	$tsf = the_seo_framework();

	$title       = seo_rest_clean_title( $tsf->get_title( $args ) );
	$description = $tsf->get_description( $args );
	$og_title    = seo_rest_clean_title( $tsf->get_social_title( $args ) ) ?: $title;
	$og_desc     = $tsf->get_social_description( $args ) ?: $description;
	$tw_title    = seo_rest_clean_title( $tsf->get_twitter_title( $args ) ) ?: $og_title;
	$tw_desc     = $tsf->get_twitter_description( $args ) ?: $og_desc;

	$metadata = [
		'title'       => $title,
		'description' => $description,
		'alternates'  => [
			'canonical' => $tsf->get_canonical_url( $args ),
		],
		'robots'      => seo_rest_parse_robots( $tsf->get_robots_value( $args ) ),
		'openGraph'   => [
			'title'       => $og_title,
			'description' => $og_desc,
			'type'        => 'website',
			'images'      => [],
		],
		'twitter'     => [
			'card'        => $tsf->get_twitter_card_value( $args ) ?: 'summary_large_image',
			'title'       => $tw_title,
			'description' => $tw_desc,
			'images'      => [],
		],
	];

	// Handle Images
	$og_images = $tsf->get_image_details( $args, true );
	if ( ! empty( $og_images ) ) {
		$metadata['openGraph']['images'][] = [ 'url' => reset( $og_images )['url'] ];
	}

	$tw_images = $tsf->get_twitter_image_details( $args, true );
	if ( ! empty( $tw_images ) ) {
		$metadata['twitter']['images'][] = reset( $tw_images )['url'];
	} elseif ( ! empty( $og_images ) ) {
		$metadata['twitter']['images'][] = reset( $og_images )['url'];
	}

	// Recursively remove empty values
	return array_filter( $metadata, function($v) {
		return ! empty($v);
	});
}

function seo_rest_get_by_uri( WP_REST_Request $request ): WP_REST_Response {
	$uri = trailingslashit( $request->get_param( 'uri' ) );
	if ( $uri === '/' ) return seo_rest_get_global( $request );

	$post_id = url_to_postid( home_url( $uri ) );
	if ( $post_id ) {
		return new WP_REST_Response( seo_rest_get_metadata_object( [ 'id' => $post_id ] ) );
	}

	return seo_rest_from_term( $uri );
}

function seo_rest_from_term( string $uri ): WP_REST_Response {
	$parts = array_values( array_filter( explode( '/', $uri ) ) );
	$slug  = end( $parts );
	$tax_map = [ 'product-category' => 'product_cat', 'product-tag' => 'product_tag', 'category' => 'category', 'tag' => 'post_tag' ];
	$tax = $tax_map[ $parts[ count( $parts ) - 2 ] ?? '' ] ?? '';

	if ( $tax && $slug ) {
		$term = get_term_by( 'slug', $slug, $tax );
		if ( $term && ! is_wp_error( $term ) ) {
			return new WP_REST_Response( seo_rest_get_metadata_object( [ 'id' => $term->term_id, 'taxonomy' => $tax ] ) );
		}
	}
	
	if ( count( $parts ) >= 2 && $parts[0] === 'product' ) {
		$post = get_page_by_path( $parts[1], OBJECT, 'product' );
		if ( $post ) return new WP_REST_Response( seo_rest_get_metadata_object( [ 'id' => $post->ID ] ) );
	}

	return new WP_REST_Response( [] );
}

function seo_rest_get_global( WP_REST_Request $request ): WP_REST_Response {
	if ( ! function_exists( 'the_seo_framework' ) ) return new WP_REST_Response( [] );
	$tsf = the_seo_framework();
	return new WP_REST_Response( [
		'title'       => $tsf->get_home_title() ?: get_bloginfo( 'name' ),
		'description' => $tsf->get_home_description() ?: get_bloginfo( 'description' ),
	] );
}
