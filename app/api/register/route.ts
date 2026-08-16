import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation";
import { MethodConfig, User } from "@/lib/models";
import { error, handleApiError, json } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return json(
        { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
        422,
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return error("Ya existe una cuenta con ese email", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, passwordHash });

    // Metodología por defecto: bloques de 6 semanas con RIR 3,3,2,2,1,1
    // y week 7 de descarga al 60% + test AMRAP.
    await MethodConfig.create({
      userId: user.id,
      name: "Evidencia 6+1",
    });

    return json({ id: user.id, name: user.name, email: user.email }, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
