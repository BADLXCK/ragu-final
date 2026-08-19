/* eslint-disable */
import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n\t\tquery getCategories {\n\t\t\tproductCategories(first: 1000, where: { hideEmpty: false }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": typeof types.GetCategoriesDocument,
    "\n\t\tquery getCategory($slug: [String]) {\n\t\t\tproductCategories(where: { slug: $slug }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": typeof types.GetCategoryDocument,
    "\n\t\tquery getEvents {\n\t\t\tevents(first: 1000, where: { status: PUBLISH }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\teventdate\n\t\t\t\t\teventdescription\n\t\t\t\t\teventname\n\t\t\t\t\teventimage {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\tsrcSet\n\t\t\t\t\t\t\tsourceUrl\n\t\t\t\t\t\t\taltText\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": typeof types.GetEventsDocument,
    "\n\t\tquery getMediaByFolder($folderName: String!, $after: String, $first: Int) {\n\t\t\tmediaByFolder(where: { folderName: $folderName }, first: $first, after: $after) {\n\t\t\t\tnodes {\n\t\t\t\t\tdatabaseId\n\t\t\t\t\tsourceUrl\n\t\t\t\t\taltText\n\t\t\t\t}\n\t\t\t\tpageInfo {\n\t\t\t\t\thasNextPage\n\t\t\t\t\tendCursor\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": typeof types.GetMediaByFolderDocument,
    "\n\t\tquery getMediaFolders {\n\t\t\tmediaFolders {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tparent\n\t\t\t}\n\t\t}\n\t": typeof types.GetMediaFoldersDocument,
    "\n\t\tquery getNavigationItems {\n\t\t\tmenuItems(where: { location: PRIMARY }) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\turl\n\t\t\t\t\t\turi\n\t\t\t\t\t\tpath\n\t\t\t\t\t\tlabel\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": typeof types.GetNavigationItemsDocument,
    "\n\t\tquery getPageTitle($slug: String!) {\n\t\t\tpageBy(uri: $slug) {\n\t\t\t\ttitle\n\t\t\t}\n\t\t}\n\t": typeof types.GetPageTitleDocument,
    "\n\t\tquery getProduct($slug: String!) {\n\t\t\tproducts(where: { slugIn: [$slug] }) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tdescription(format: RAW)\n\t\t\t\t\t\tslug\n\t\t\t\t\t\tcustomWeight\n\t\t\t\t\t\tcustomProtein\n\t\t\t\t\t\tcustomFat\n\t\t\t\t\t\tcustomCarbohydrate\n\t\t\t\t\t\timage {\n\t\t\t\t\t\t\tfilePath\n\t\t\t\t\t\t\taltText\n\t\t\t\t\t\t}\n\t\t\t\t\t\tproductCategories {\n\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\tslug\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\t... on SimpleProduct {\n\t\t\t\t\t\t\tprice(format: RAW)\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": typeof types.GetProductDocument,
    "\n\t\tquery getProductsByCategory($categorySlug: String!) {\n\t\t\tproducts(first: 1000, where: { category: $categorySlug }) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tdescription(format: RAW)\n\t\t\t\t\t\tslug\n\t\t\t\t\t\tcustomWeight\n\t\t\t\t\t\tcustomProtein\n\t\t\t\t\t\tcustomFat\n\t\t\t\t\t\tcustomCarbohydrate\n\t\t\t\t\t\timage {\n\t\t\t\t\t\t\tfilePath\n\t\t\t\t\t\t\taltText\n\t\t\t\t\t\t}\n\t\t\t\t\t\tproductCategories {\n\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\tslug\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\t... on SimpleProduct {\n\t\t\t\t\t\t\tprice(format: RAW)\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": typeof types.GetProductsByCategoryDocument,
};
const documents: Documents = {
    "\n\t\tquery getCategories {\n\t\t\tproductCategories(first: 1000, where: { hideEmpty: false }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": types.GetCategoriesDocument,
    "\n\t\tquery getCategory($slug: [String]) {\n\t\t\tproductCategories(where: { slug: $slug }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": types.GetCategoryDocument,
    "\n\t\tquery getEvents {\n\t\t\tevents(first: 1000, where: { status: PUBLISH }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\teventdate\n\t\t\t\t\teventdescription\n\t\t\t\t\teventname\n\t\t\t\t\teventimage {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\tsrcSet\n\t\t\t\t\t\t\tsourceUrl\n\t\t\t\t\t\t\taltText\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": types.GetEventsDocument,
    "\n\t\tquery getMediaByFolder($folderName: String!, $after: String, $first: Int) {\n\t\t\tmediaByFolder(where: { folderName: $folderName }, first: $first, after: $after) {\n\t\t\t\tnodes {\n\t\t\t\t\tdatabaseId\n\t\t\t\t\tsourceUrl\n\t\t\t\t\taltText\n\t\t\t\t}\n\t\t\t\tpageInfo {\n\t\t\t\t\thasNextPage\n\t\t\t\t\tendCursor\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": types.GetMediaByFolderDocument,
    "\n\t\tquery getMediaFolders {\n\t\t\tmediaFolders {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tparent\n\t\t\t}\n\t\t}\n\t": types.GetMediaFoldersDocument,
    "\n\t\tquery getNavigationItems {\n\t\t\tmenuItems(where: { location: PRIMARY }) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\turl\n\t\t\t\t\t\turi\n\t\t\t\t\t\tpath\n\t\t\t\t\t\tlabel\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": types.GetNavigationItemsDocument,
    "\n\t\tquery getPageTitle($slug: String!) {\n\t\t\tpageBy(uri: $slug) {\n\t\t\t\ttitle\n\t\t\t}\n\t\t}\n\t": types.GetPageTitleDocument,
    "\n\t\tquery getProduct($slug: String!) {\n\t\t\tproducts(where: { slugIn: [$slug] }) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tdescription(format: RAW)\n\t\t\t\t\t\tslug\n\t\t\t\t\t\tcustomWeight\n\t\t\t\t\t\tcustomProtein\n\t\t\t\t\t\tcustomFat\n\t\t\t\t\t\tcustomCarbohydrate\n\t\t\t\t\t\timage {\n\t\t\t\t\t\t\tfilePath\n\t\t\t\t\t\t\taltText\n\t\t\t\t\t\t}\n\t\t\t\t\t\tproductCategories {\n\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\tslug\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\t... on SimpleProduct {\n\t\t\t\t\t\t\tprice(format: RAW)\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": types.GetProductDocument,
    "\n\t\tquery getProductsByCategory($categorySlug: String!) {\n\t\t\tproducts(first: 1000, where: { category: $categorySlug }) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tdescription(format: RAW)\n\t\t\t\t\t\tslug\n\t\t\t\t\t\tcustomWeight\n\t\t\t\t\t\tcustomProtein\n\t\t\t\t\t\tcustomFat\n\t\t\t\t\t\tcustomCarbohydrate\n\t\t\t\t\t\timage {\n\t\t\t\t\t\t\tfilePath\n\t\t\t\t\t\t\taltText\n\t\t\t\t\t\t}\n\t\t\t\t\t\tproductCategories {\n\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\tslug\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\t... on SimpleProduct {\n\t\t\t\t\t\t\tprice(format: RAW)\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": types.GetProductsByCategoryDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tquery getCategories {\n\t\t\tproductCategories(first: 1000, where: { hideEmpty: false }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tquery getCategories {\n\t\t\tproductCategories(first: 1000, where: { hideEmpty: false }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tquery getCategory($slug: [String]) {\n\t\t\tproductCategories(where: { slug: $slug }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tquery getCategory($slug: [String]) {\n\t\t\tproductCategories(where: { slug: $slug }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\tslug\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tquery getEvents {\n\t\t\tevents(first: 1000, where: { status: PUBLISH }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\teventdate\n\t\t\t\t\teventdescription\n\t\t\t\t\teventname\n\t\t\t\t\teventimage {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\tsrcSet\n\t\t\t\t\t\t\tsourceUrl\n\t\t\t\t\t\t\taltText\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tquery getEvents {\n\t\t\tevents(first: 1000, where: { status: PUBLISH }) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\teventdate\n\t\t\t\t\teventdescription\n\t\t\t\t\teventname\n\t\t\t\t\teventimage {\n\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\tsrcSet\n\t\t\t\t\t\t\tsourceUrl\n\t\t\t\t\t\t\taltText\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tquery getMediaByFolder($folderName: String!, $after: String, $first: Int) {\n\t\t\tmediaByFolder(where: { folderName: $folderName }, first: $first, after: $after) {\n\t\t\t\tnodes {\n\t\t\t\t\tdatabaseId\n\t\t\t\t\tsourceUrl\n\t\t\t\t\taltText\n\t\t\t\t}\n\t\t\t\tpageInfo {\n\t\t\t\t\thasNextPage\n\t\t\t\t\tendCursor\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tquery getMediaByFolder($folderName: String!, $after: String, $first: Int) {\n\t\t\tmediaByFolder(where: { folderName: $folderName }, first: $first, after: $after) {\n\t\t\t\tnodes {\n\t\t\t\t\tdatabaseId\n\t\t\t\t\tsourceUrl\n\t\t\t\t\taltText\n\t\t\t\t}\n\t\t\t\tpageInfo {\n\t\t\t\t\thasNextPage\n\t\t\t\t\tendCursor\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tquery getMediaFolders {\n\t\t\tmediaFolders {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tparent\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tquery getMediaFolders {\n\t\t\tmediaFolders {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tparent\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tquery getNavigationItems {\n\t\t\tmenuItems(where: { location: PRIMARY }) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\turl\n\t\t\t\t\t\turi\n\t\t\t\t\t\tpath\n\t\t\t\t\t\tlabel\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tquery getNavigationItems {\n\t\t\tmenuItems(where: { location: PRIMARY }) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\turl\n\t\t\t\t\t\turi\n\t\t\t\t\t\tpath\n\t\t\t\t\t\tlabel\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tquery getPageTitle($slug: String!) {\n\t\t\tpageBy(uri: $slug) {\n\t\t\t\ttitle\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tquery getPageTitle($slug: String!) {\n\t\t\tpageBy(uri: $slug) {\n\t\t\t\ttitle\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tquery getProduct($slug: String!) {\n\t\t\tproducts(where: { slugIn: [$slug] }) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tdescription(format: RAW)\n\t\t\t\t\t\tslug\n\t\t\t\t\t\tcustomWeight\n\t\t\t\t\t\tcustomProtein\n\t\t\t\t\t\tcustomFat\n\t\t\t\t\t\tcustomCarbohydrate\n\t\t\t\t\t\timage {\n\t\t\t\t\t\t\tfilePath\n\t\t\t\t\t\t\taltText\n\t\t\t\t\t\t}\n\t\t\t\t\t\tproductCategories {\n\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\tslug\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\t... on SimpleProduct {\n\t\t\t\t\t\t\tprice(format: RAW)\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tquery getProduct($slug: String!) {\n\t\t\tproducts(where: { slugIn: [$slug] }) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tdescription(format: RAW)\n\t\t\t\t\t\tslug\n\t\t\t\t\t\tcustomWeight\n\t\t\t\t\t\tcustomProtein\n\t\t\t\t\t\tcustomFat\n\t\t\t\t\t\tcustomCarbohydrate\n\t\t\t\t\t\timage {\n\t\t\t\t\t\t\tfilePath\n\t\t\t\t\t\t\taltText\n\t\t\t\t\t\t}\n\t\t\t\t\t\tproductCategories {\n\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\tslug\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\t... on SimpleProduct {\n\t\t\t\t\t\t\tprice(format: RAW)\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tquery getProductsByCategory($categorySlug: String!) {\n\t\t\tproducts(first: 1000, where: { category: $categorySlug }) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tdescription(format: RAW)\n\t\t\t\t\t\tslug\n\t\t\t\t\t\tcustomWeight\n\t\t\t\t\t\tcustomProtein\n\t\t\t\t\t\tcustomFat\n\t\t\t\t\t\tcustomCarbohydrate\n\t\t\t\t\t\timage {\n\t\t\t\t\t\t\tfilePath\n\t\t\t\t\t\t\taltText\n\t\t\t\t\t\t}\n\t\t\t\t\t\tproductCategories {\n\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\tslug\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\t... on SimpleProduct {\n\t\t\t\t\t\t\tprice(format: RAW)\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tquery getProductsByCategory($categorySlug: String!) {\n\t\t\tproducts(first: 1000, where: { category: $categorySlug }) {\n\t\t\t\tedges {\n\t\t\t\t\tnode {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tname\n\t\t\t\t\t\tdescription(format: RAW)\n\t\t\t\t\t\tslug\n\t\t\t\t\t\tcustomWeight\n\t\t\t\t\t\tcustomProtein\n\t\t\t\t\t\tcustomFat\n\t\t\t\t\t\tcustomCarbohydrate\n\t\t\t\t\t\timage {\n\t\t\t\t\t\t\tfilePath\n\t\t\t\t\t\t\taltText\n\t\t\t\t\t\t}\n\t\t\t\t\t\tproductCategories {\n\t\t\t\t\t\t\tnodes {\n\t\t\t\t\t\t\t\tslug\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\t... on SimpleProduct {\n\t\t\t\t\t\t\tprice(format: RAW)\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}