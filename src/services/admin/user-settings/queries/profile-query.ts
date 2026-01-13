import { getUserProfile } from "../repos/profile-repo";

export async function queryUserProfile(userId: number) {
  return await getUserProfile(userId);
}
