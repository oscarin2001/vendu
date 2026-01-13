import { updateUserProfile } from "../repos/profile-repo";

export async function mutateUserProfile(userId: number, data: any) {
  return await updateUserProfile(userId, data);
}
