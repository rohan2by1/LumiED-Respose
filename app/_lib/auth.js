import { ReE } from "@/app/_utils/responseHandler.util";
import { verifyAdminSession, verifySession, verifyUserSession } from "@/app/_lib/session";

export async function adminAuth() {
  const isAdmin = await verifyAdminSession();

  // if (!isAdmin)
  //   unauthorized();

  if (!isAdmin) {
    return ReE("Unauthorized", "Admin access required", 403);
  }

  return null;
}

export async function userAuth() {
  const isUser = await verifyUserSession();

  // if (!isUser)
  //     unauthorized();

  if (!isUser) {
    return ReE("Unauthorized", "User access required", 403);
  }

  return null;
}

export async function getUserID() {
  const user = await verifySession();
  
  if (!user?.isAuth || !user?.user_id) {
    return ReE("Unauthorized", "User access required", 403);
  }

  return user.user_id;
}
