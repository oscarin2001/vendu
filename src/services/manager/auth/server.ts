/**
 * Server-only exports for manager authentication
 * Use this file only in Server Components or API routes
 */

// Services
export { validateManagerCredentials, getManagerSessionData } from "./services";

// Adapters (require next/headers)
export {
  setManagerAuthCookie,
  getManagerAuthCookie,
  clearManagerAuthCookie,
  isManagerAuthenticated,
  signManagerJwt,
  verifyManagerJwt,
} from "./adapters";
