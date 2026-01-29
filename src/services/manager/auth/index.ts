// Actions (server-side, can be used with useActionState)
export {
  managerLoginAction,
  managerLogoutAction,
  checkManagerAuthStatus,
  checkManagerAuthAndRedirect,
} from "./actions";

// Types (safe for client and server)
export type {
  ManagerAuthPayload,
  ManagerLoginCredentials,
  ManagerLoginResult,
  ManagerSession,
  ManagerBranchAssignment,
  ManagerWarehouseAssignment,
} from "./types";
