import { Role } from "./roles";

export function isOwner(actor: { role: string }) {
  return actor.role === Role.OWNER;
}
export function isSuperAdmin(actor: { role: string }) {
  return actor.role === Role.SUPER_ADMIN;
}
