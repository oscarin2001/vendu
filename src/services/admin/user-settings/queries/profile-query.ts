import { getUserProfile, getUserAccountByAuthId } from "../repos/profile-repo";

export async function queryUserProfile(userId: number) {
  return await getUserProfile(userId);
}

/**
 * Query para obtener los datos de cuenta del usuario autenticado
 * @param authId - El PK_auth del usuario (userId de la sesión JWT)
 */
export async function queryUserAccountProfile(authId: number) {
  return await getUserAccountByAuthId(authId);
}
