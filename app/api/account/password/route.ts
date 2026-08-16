import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getSessionUser } from "@/lib/auth-helpers";
import { changePasswordSchema } from "@/lib/validation";
import { error, handleApiError, json, unauthorized } from "@/lib/api";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorized();

    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        422,
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return error("La contraseña actual no es correcta", 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash });

    return json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
