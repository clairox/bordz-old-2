/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n\tmutation Login(\n\t\t$email: String!\n\t\t$password: String!\n\t) {\n\t\tcustomerAccessTokenCreate(\n\t\t\tinput: { email: $email, password: $password }\n\t\t) {\n\t\t\tcustomerAccessToken {\n\t\t\t\taccessToken\n\t\t\t\texpiresAt\n\t\t\t}\n\t\t\tcustomerUserErrors {\n\t\t\t\tcode\n\t\t\t\tfield\n\t\t\t\tmessage\n\t\t\t}\n\t\t\tuserErrors {\n\t\t\t\tfield\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.LoginDocument,
    "\n\tquery GetCollection(\n\t\t$handle: String!\n\t\t$limit: Int!\n\t\t$sortKey: ProductCollectionSortKeys!\n\t\t$filters: [ProductFilter!]\n\t\t$reverse: Boolean = false\n\t) {\n\t\tcollection(handle: $handle) {\n\t\t\ttitle\n\t\t\tproducts(first: $limit, sortKey: $sortKey, reverse: $reverse, filters: $filters) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\ttitle\n\t\t\t\t\thandle\n\t\t\t\t\tdescription\n\t\t\t\t\tavailableForSale\n\t\t\t\t\tpriceRange {\n\t\t\t\t\t\tmaxVariantPrice {\n\t\t\t\t\t\t\tamount\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tfeaturedImage {\n\t\t\t\t\t\tsrc\n\t\t\t\t\t\twidth\n\t\t\t\t\t\theight\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tpageInfo {\n\t\t\t\t\thasNextPage\n\t\t\t\t}\n\t\t\t\tfilters {\n\t\t\t\t\tlabel\n\t\t\t\t\tvalues {\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tinput\n\t\t\t\t\t\tcount\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.GetCollectionDocument,
    "\n\tquery GetCollectionMaxPrice(\n\t\t$handle: String!\n\t\t$limit: Int!\n\t\t$filters: [ProductFilter!]\n\t) {\n\t\tcollection(handle: $handle) {\n\t\t\tproducts(first: $limit, filters: $filters) {\n\t\t\t\tnodes {\n\t\t\t\t\tpriceRange {\n\t\t\t\t\t\tmaxVariantPrice {\n\t\t\t\t\t\t\tamount\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.GetCollectionMaxPriceDocument,
    "\n\tquery GetCustomer(\n\t\t$customerAccessToken: String!\n\t) {\n\t\tcustomer(customerAccessToken: $customerAccessToken) {\n\t\t\tid\n\t\t\temail\n\t\t\tfirstName\n\t\t\tlastName\n\t\t\tdisplayName\n\t\t}\n\t}\n": types.GetCustomerDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tmutation Login(\n\t\t$email: String!\n\t\t$password: String!\n\t) {\n\t\tcustomerAccessTokenCreate(\n\t\t\tinput: { email: $email, password: $password }\n\t\t) {\n\t\t\tcustomerAccessToken {\n\t\t\t\taccessToken\n\t\t\t\texpiresAt\n\t\t\t}\n\t\t\tcustomerUserErrors {\n\t\t\t\tcode\n\t\t\t\tfield\n\t\t\t\tmessage\n\t\t\t}\n\t\t\tuserErrors {\n\t\t\t\tfield\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation Login(\n\t\t$email: String!\n\t\t$password: String!\n\t) {\n\t\tcustomerAccessTokenCreate(\n\t\t\tinput: { email: $email, password: $password }\n\t\t) {\n\t\t\tcustomerAccessToken {\n\t\t\t\taccessToken\n\t\t\t\texpiresAt\n\t\t\t}\n\t\t\tcustomerUserErrors {\n\t\t\t\tcode\n\t\t\t\tfield\n\t\t\t\tmessage\n\t\t\t}\n\t\t\tuserErrors {\n\t\t\t\tfield\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetCollection(\n\t\t$handle: String!\n\t\t$limit: Int!\n\t\t$sortKey: ProductCollectionSortKeys!\n\t\t$filters: [ProductFilter!]\n\t\t$reverse: Boolean = false\n\t) {\n\t\tcollection(handle: $handle) {\n\t\t\ttitle\n\t\t\tproducts(first: $limit, sortKey: $sortKey, reverse: $reverse, filters: $filters) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\ttitle\n\t\t\t\t\thandle\n\t\t\t\t\tdescription\n\t\t\t\t\tavailableForSale\n\t\t\t\t\tpriceRange {\n\t\t\t\t\t\tmaxVariantPrice {\n\t\t\t\t\t\t\tamount\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tfeaturedImage {\n\t\t\t\t\t\tsrc\n\t\t\t\t\t\twidth\n\t\t\t\t\t\theight\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tpageInfo {\n\t\t\t\t\thasNextPage\n\t\t\t\t}\n\t\t\t\tfilters {\n\t\t\t\t\tlabel\n\t\t\t\t\tvalues {\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tinput\n\t\t\t\t\t\tcount\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCollection(\n\t\t$handle: String!\n\t\t$limit: Int!\n\t\t$sortKey: ProductCollectionSortKeys!\n\t\t$filters: [ProductFilter!]\n\t\t$reverse: Boolean = false\n\t) {\n\t\tcollection(handle: $handle) {\n\t\t\ttitle\n\t\t\tproducts(first: $limit, sortKey: $sortKey, reverse: $reverse, filters: $filters) {\n\t\t\t\tnodes {\n\t\t\t\t\tid\n\t\t\t\t\ttitle\n\t\t\t\t\thandle\n\t\t\t\t\tdescription\n\t\t\t\t\tavailableForSale\n\t\t\t\t\tpriceRange {\n\t\t\t\t\t\tmaxVariantPrice {\n\t\t\t\t\t\t\tamount\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tfeaturedImage {\n\t\t\t\t\t\tsrc\n\t\t\t\t\t\twidth\n\t\t\t\t\t\theight\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tpageInfo {\n\t\t\t\t\thasNextPage\n\t\t\t\t}\n\t\t\t\tfilters {\n\t\t\t\t\tlabel\n\t\t\t\t\tvalues {\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tinput\n\t\t\t\t\t\tcount\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetCollectionMaxPrice(\n\t\t$handle: String!\n\t\t$limit: Int!\n\t\t$filters: [ProductFilter!]\n\t) {\n\t\tcollection(handle: $handle) {\n\t\t\tproducts(first: $limit, filters: $filters) {\n\t\t\t\tnodes {\n\t\t\t\t\tpriceRange {\n\t\t\t\t\t\tmaxVariantPrice {\n\t\t\t\t\t\t\tamount\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCollectionMaxPrice(\n\t\t$handle: String!\n\t\t$limit: Int!\n\t\t$filters: [ProductFilter!]\n\t) {\n\t\tcollection(handle: $handle) {\n\t\t\tproducts(first: $limit, filters: $filters) {\n\t\t\t\tnodes {\n\t\t\t\t\tpriceRange {\n\t\t\t\t\t\tmaxVariantPrice {\n\t\t\t\t\t\t\tamount\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetCustomer(\n\t\t$customerAccessToken: String!\n\t) {\n\t\tcustomer(customerAccessToken: $customerAccessToken) {\n\t\t\tid\n\t\t\temail\n\t\t\tfirstName\n\t\t\tlastName\n\t\t\tdisplayName\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCustomer(\n\t\t$customerAccessToken: String!\n\t) {\n\t\tcustomer(customerAccessToken: $customerAccessToken) {\n\t\t\tid\n\t\t\temail\n\t\t\tfirstName\n\t\t\tlastName\n\t\t\tdisplayName\n\t\t}\n\t}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;