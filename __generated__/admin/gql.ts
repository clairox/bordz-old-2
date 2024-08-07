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
    "\n\tmutation DeleteCustomer($id: ID!) {\n\t\tcustomerDelete(input: { id: $id }) {\n\t\t\tdeletedCustomerId\n\t\t\tuserErrors {\n\t\t\t\tfield\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n": types.DeleteCustomerDocument,
    "\n\tquery GetProductVariants(\n\t\t$limit: Int!\n\t\t$query: String!\n\t) {\n\tproductVariants(first: $limit, query: $query) {\n        nodes {\n            availableForSale\n            compareAtPrice\n            id\n            price\n            title\n            product {\n                handle\n                id\n                title\n                featuredImage {\n                    altText\n                    height\n                    src\n                    width\n                }\n            }\n            selectedOptions {\n                name\n                value\n            }\n        }\n        pageInfo {\n            hasNextPage\n        }\n    }\t\n}\n": types.GetProductVariantsDocument,
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
export function gql(source: "\n\tmutation DeleteCustomer($id: ID!) {\n\t\tcustomerDelete(input: { id: $id }) {\n\t\t\tdeletedCustomerId\n\t\t\tuserErrors {\n\t\t\t\tfield\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation DeleteCustomer($id: ID!) {\n\t\tcustomerDelete(input: { id: $id }) {\n\t\t\tdeletedCustomerId\n\t\t\tuserErrors {\n\t\t\t\tfield\n\t\t\t\tmessage\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n\tquery GetProductVariants(\n\t\t$limit: Int!\n\t\t$query: String!\n\t) {\n\tproductVariants(first: $limit, query: $query) {\n        nodes {\n            availableForSale\n            compareAtPrice\n            id\n            price\n            title\n            product {\n                handle\n                id\n                title\n                featuredImage {\n                    altText\n                    height\n                    src\n                    width\n                }\n            }\n            selectedOptions {\n                name\n                value\n            }\n        }\n        pageInfo {\n            hasNextPage\n        }\n    }\t\n}\n"): (typeof documents)["\n\tquery GetProductVariants(\n\t\t$limit: Int!\n\t\t$query: String!\n\t) {\n\tproductVariants(first: $limit, query: $query) {\n        nodes {\n            availableForSale\n            compareAtPrice\n            id\n            price\n            title\n            product {\n                handle\n                id\n                title\n                featuredImage {\n                    altText\n                    height\n                    src\n                    width\n                }\n            }\n            selectedOptions {\n                name\n                value\n            }\n        }\n        pageInfo {\n            hasNextPage\n        }\n    }\t\n}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;