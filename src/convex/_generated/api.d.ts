/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin from "../admin.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as games from "../games.js";
import type * as generators_makeAdmin from "../generators/makeAdmin.js";
import type * as generators_seedData from "../generators/seedData.js";
import type * as http from "../http.js";
import type * as leaderboards from "../leaderboards.js";
import type * as matches from "../matches.js";
import type * as payments from "../payments.js";
import type * as support from "../support.js";
import type * as transactions from "../transactions.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  games: typeof games;
  "generators/makeAdmin": typeof generators_makeAdmin;
  "generators/seedData": typeof generators_seedData;
  http: typeof http;
  leaderboards: typeof leaderboards;
  matches: typeof matches;
  payments: typeof payments;
  support: typeof support;
  transactions: typeof transactions;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
