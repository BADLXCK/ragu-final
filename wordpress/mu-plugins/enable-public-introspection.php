<?php
/**
 * WPGraphQL — enable public introspection
 *
 * Required for GraphQL codegen (`npm run codegen`) to load the schema.
 */

add_filter( 'graphql_should_enable_public_introspection', '__return_true' );
