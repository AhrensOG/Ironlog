import { auth } from "@/auth";
import { User } from "@/lib/models";

export async function getSessionUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function getSessionUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return User.findByPk(userId);
}

export async function requireUserId(): Promise<string> {
  const userId = await getSessionUserId();
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }
  return userId;
}
