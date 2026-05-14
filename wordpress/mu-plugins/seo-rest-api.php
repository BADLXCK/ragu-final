<?php
/**
 * SEO REST API — The SEO Framework bridge
 *
 * Exposes SEO data (title, description, og:image) from The SEO Framework
 * via a simple REST API endpoint, without requiring WPGraphQL.
 *
 * Endpoints:
 *   GET /wp-json/seo/v1/page?uri=/some-page/
 *   GET /wp-json/seo/v1/global
 */

add_action( 'rest_api_init', function () {

	// 🔹 Page/post SEO by URI
	register_rest_route( 'seo/v1', '/page', [
		'methods'             => 'GET',
		'callback'            => 'seo_rest_get_by_uri',
		'permission_callback' => '__return_true',
		'args'                => [
			'uri' => [
				'required'          => true,
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
			],
		],
	] );

	// 🔹 Global site SEO
	register_rest_route( 'seo/v1', '/global', [
		'methods'             => 'GET',
		'callback'            => 'seo_rest_get_global',
		'permission_callback' => '__return_true',
	] );
} );

/**
 * Returns SEO data for a given URI using The SEO Framework.
 */
function seo_rest_get_by_uri( WP_REST_Request $request ): WP_REST_Response {
	$uri = trailingslashit( $request->get_param( 'uri' ) );

	// 🔹 Homepage: uri === '/'
	if ( $uri === '/' ) {
		return seo_rest_get_global( $request );
	}

	$post_id = url_to_postid( home_url( $uri ) );

	if ( $post_id ) {
		return seo_rest_from_post( $post_id );
	}

	// Try as a term (product category, tag, etc.)
	return seo_rest_from_term( $uri );
}

/**
 * Build SEO response from a post ID using TSF.
 */
function seo_rest_from_post( int $post_id ): WP_REST_Response {
	if ( ! function_exists( 'the_seo_framework' ) ) {
		return seo_rest_fallback_post( $post_id );
	}

	$tsf  = the_seo_framework();
	$args = [ 'id' => $post_id ];

	$title       = $tsf->get_title( $args );
	$description = $tsf->get_description( $args );
	$og_image    = '';

	// Try to get OG image URL
	$images = $tsf->get_image_details( $args, true );
	if ( ! empty( $images ) ) {
		$og_image = reset( $images )['url'] ?? '';
	}

	return new WP_REST_Response( [
		'title'       => $title ?: '',
		'description' => $description ?: '',
		'og_image'    => $og_image ?: '',
	] );
}

/**
 * Attempt to get SEO data for a taxonomy term (category, product category, etc.)
 */
function seo_rest_from_term( string $uri ): WP_REST_Response {
	// Match patterns like /product-category/soups/ or /tag/foo/
	$parts    = array_values( array_filter( explode( '/', $uri ) ) );
	$slug     = end( $parts );
	$taxonomy = count( $parts ) > 1 ? $parts[ count( $parts ) - 2 ] : '';

	// Map URL segment to taxonomy name
	$taxonomy_map = [
		'product-category' => 'product_cat',
		'product-tag'      => 'product_tag',
		'category'         => 'category',
		'tag'              => 'post_tag',
	];

	$taxonomy_name = $taxonomy_map[ $taxonomy ] ?? '';

	if ( $taxonomy_name && $slug ) {
		$term = get_term_by( 'slug', $slug, $taxonomy_name );
		if ( $term && ! is_wp_error( $term ) && function_exists( 'the_seo_framework' ) ) {
			$tsf  = the_seo_framework();
			$args = [ 'id' => $term->term_id, 'taxonomy' => $taxonomy_name ];

			return new WP_REST_Response( [
				'title'       => $tsf->get_title( $args ) ?: '',
				'description' => $tsf->get_description( $args ) ?: '',
				'og_image'    => '',
			] );
		}
	}

	// Try products by slug (uri like /product/slug/)
	if ( count( $parts ) >= 2 && $parts[0] === 'product' ) {
		$product_post = get_page_by_path( $parts[1], OBJECT, 'product' );
		if ( $product_post && function_exists( 'the_seo_framework' ) ) {
			return seo_rest_from_post( $product_post->ID );
		}
	}

	return new WP_REST_Response( [ 'title' => '', 'description' => '', 'og_image' => '' ] );
}

/**
 * Fallback: read SEO data directly from post meta (when TSF is not yet loaded).
 */
function seo_rest_fallback_post( int $post_id ): WP_REST_Response {
	return new WP_REST_Response( [
		'title'       => get_post_meta( $post_id, '_genesis_title', true ) ?: get_the_title( $post_id ),
		'description' => get_post_meta( $post_id, '_genesis_description', true ) ?: '',
		'og_image'    => '',
	] );
}

/**
 * Returns global site SEO settings (also used for homepage).
 */
function seo_rest_get_global( WP_REST_Request $request ): WP_REST_Response {
	$title       = get_bloginfo( 'name' );
	$description = get_bloginfo( 'description' );

	if ( function_exists( 'the_seo_framework' ) ) {
		$tsf         = the_seo_framework();
		$home_title  = $tsf->get_home_title();
		$home_desc   = $tsf->get_home_description();
		$title       = $home_title ?: $title;
		$description = $home_desc ?: $description;
	}

	return new WP_REST_Response( [
		'title'       => $title ?: '',
		'description' => $description ?: '',
		'og_image'    => '',
	] );
}
