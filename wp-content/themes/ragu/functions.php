<?php
/**
 * Intentionally Blank Theme functions
 *
 * @package WordPress
 * @subpackage intentionally-blank
 */

if ( ! function_exists( 'blank_setup' ) ) :
	/**
	 * Sets up theme defaults and registers the various WordPress features that
	 * this theme supports.
	 */
	function blank_setup() {
		load_theme_textdomain( 'intentionally-blank' );
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );

		// This theme allows users to set a custom background.
		add_theme_support(
			'custom-background',
			array(
				'default-color' => 'f5f5f5',
			)
		);

		add_theme_support( 'custom-logo' );
		add_theme_support(
			'custom-logo',
			array(
				'height'      => 256,
				'width'       => 256,
				'flex-height' => true,
				'flex-width'  => true,
				'header-text' => array( 'site-title', 'site-description' ),
			)
		);
	}
endif; // end function_exists blank_setup.

add_action( 'after_setup_theme', 'blank_setup' );

remove_action( 'wp_head', '_custom_logo_header_styles' );

if ( ! is_admin() ) {
	add_action(
		'wp_enqueue_scripts',
		function() {
			wp_dequeue_style( 'global-styles' );
			wp_dequeue_style( 'classic-theme-styles' );
			wp_dequeue_style( 'wp-block-library' );
		}
	);
}
/**
 * Sets up theme defaults and registers the various WordPress features that
 * this theme supports.

 * @param class $wp_customize Customizer object.
 */
function blank_customize_register( $wp_customize ) {
	$wp_customize->remove_section( 'static_front_page' );

	$wp_customize->add_section(
		'blank_footer',
		array(
			'title'      => __( 'Footer', 'intentionally-blank' ),
			'priority'   => 120,
			'capability' => 'edit_theme_options',
			'panel'      => '',
		)
	);
	$wp_customize->add_setting(
		'blank_copyright',
		array(
			'type'              => 'theme_mod',
			'default'           => __( 'Intentionally Blank - Proudly powered by WordPress', 'intentionally-blank' ),
			'sanitize_callback' => 'wp_kses_post',
		)
	);

	/**
	 * Checkbox sanitization function

	 * @param bool $checked Whether the checkbox is checked.
	 * @return bool Whether the checkbox is checked.
	 */
	function blank_sanitize_checkbox( $checked ) {
		// Returns true if checkbox is checked.
		return ( ( isset( $checked ) && true === $checked ) ? true : false );
	}
	$wp_customize->add_setting(
		'blank_show_copyright',
		array(
			'default'           => true,
			'sanitize_callback' => 'blank_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'blank_copyright',
		array(
			'type'     => 'textarea',
			'label'    => __( 'Copyright Text', 'intentionally-blank' ),
			'section'  => 'blank_footer',
			'settings' => 'blank_copyright',
			'priority' => '10',
		)
	);
	$wp_customize->add_control(
		'blank_footer_copyright_hide',
		array(
			'type'     => 'checkbox',
			'label'    => __( 'Show footer with copyright Text', 'intentionally-blank' ),
			'section'  => 'blank_footer',
			'settings' => 'blank_show_copyright',
			'priority' => '20',
		)
	);
}
add_action( 'customize_register', 'blank_customize_register', 100 );

/**
 * Вывод кастомных полей в карточке товара
 */
function woocommerce_product_custom_fields()
{
    global $woocommerce, $post;
    echo '<div class="product_custom_field">';
    //Поле "Вес (гр.)"
    woocommerce_wp_text_input(
        array(
            'id' => '_custom_product_weight_field',
            'placeholder' => '',
            'label' => __('Вес (гр.)', 'woocommerce'),
            'type' => 'number',
        )
    );
    woocommerce_wp_text_input(
        array(
            'id' => '_custom_product_protein_field',
            'placeholder' => '',
            'label' => __('Белки (гр.)', 'woocommerce'),
            'type' => 'number',
        )
    );
    woocommerce_wp_text_input(
        array(
            'id' => '_custom_product_fat_field',
            'placeholder' => '',
            'label' => __('Жиры (гр.)', 'woocommerce'),
            'type' => 'number',
        )
    );
    woocommerce_wp_text_input(
        array(
            'id' => '_custom_product_carbohydrate_field',
            'placeholder' => '',
            'label' => __('Углеводы (гр.)', 'woocommerce'),
            'type' => 'number',
        )
    );
    echo '</div>';
}
add_action('woocommerce_product_options_general_product_data', 'woocommerce_product_custom_fields');

/**
 * Сохранение кастомных полей
 */
function woocommerce_product_custom_fields_save($post_id)
{
    //Поле "Вес (гр.)"
    $woocommerce_custom_product_weight_field = $_POST['_custom_product_weight_field'];
    if (!empty($woocommerce_custom_product_weight_field))
        update_post_meta($post_id, '_custom_product_weight_field', esc_attr($woocommerce_custom_product_weight_field));

    //Поле "Белки (гр.)"
    $woocommerce_custom_product_protein_field = $_POST['_custom_product_protein_field'];
    if (!empty($woocommerce_custom_product_protein_field))
        update_post_meta($post_id, '_custom_product_protein_field', esc_attr($woocommerce_custom_product_protein_field));

    //Поле "Жиры (гр.)"
    $woocommerce_custom_product_fat_field = $_POST['_custom_product_fat_field'];
    if (!empty($woocommerce_custom_product_fat_field))
        update_post_meta($post_id, '_custom_product_fat_field', esc_attr($woocommerce_custom_product_fat_field));

    //Поле "Углеводы (гр.)"
    $woocommerce_custom_product_carbohydrate_field = $_POST['_custom_product_carbohydrate_field'];
    if (!empty($woocommerce_custom_product_carbohydrate_field))
        update_post_meta($post_id, '_custom_product_carbohydrate_field', esc_attr($woocommerce_custom_product_carbohydrate_field));
}
add_action('woocommerce_process_product_meta', 'woocommerce_product_custom_fields_save');


/*
 * Расширение API woocommerce для сортировки категорий по порядку в меню
 */
function wc_register_custom_api_endpoints() {
    register_rest_route('wc/v3', '/products/categories_ordered/', array(
        'methods' => 'GET',
        'callback' => 'wc_handle_categories_ordered',
        'permission_callback' => function () {
            return current_user_can('manage_woocommerce');
        }
    ));
}
add_action('rest_api_init', 'wc_register_custom_api_endpoints');

function wc_handle_categories_ordered($request) {
    $args = array(
        'taxonomy'   => "product_cat",
        'number'     => 100,
        'hide_empty' => false,
        'orderby'    => "menu_order"
    );

    $product_categories = get_terms($args);

    return new WP_REST_Response($product_categories, 200);
}

add_action( 'after_setup_theme', 'register_primary_menu' );

function register_primary_menu() {
	register_nav_menu( 'primary', __( 'Разделы сайта', 'theme-slug' ) );
}

add_action('after_setup_theme', function () {
    register_nav_menus([
        'primary' => 'Primary Menu',
    ]);
});

/**
 * Регистрация кастомных полей для GraphQL
 */
add_action('graphql_register_types', function() {
    register_graphql_field('Product', 'customWeight', [
        'type' => 'String',
        'description' => __('Вес продукта в граммах', 'woocommerce'),
        'resolve' => function($product) {
            return get_post_meta($product->ID, '_custom_product_weight_field', true);
        }
    ]);
    
    register_graphql_field('Product', 'customProtein', [
        'type' => 'String',
        'description' => __('Содержание белков в граммах', 'woocommerce'),
        'resolve' => function($product) {
            return get_post_meta($product->ID, '_custom_product_protein_field', true);
        }
    ]);
    
    register_graphql_field('Product', 'customFat', [
        'type' => 'String',
        'description' => __('Содержание жиров в граммах', 'woocommerce'),
        'resolve' => function($product) {
            return get_post_meta($product->ID, '_custom_product_fat_field', true);
        }
    ]);
    
    register_graphql_field('Product', 'customCarbohydrate', [
        'type' => 'String',
        'description' => __('Содержание углеводов в граммах', 'woocommerce'),
        'resolve' => function($product) {
            return get_post_meta($product->ID, '_custom_product_carbohydrate_field', true);
        }
    ]);
});