import { cookies } from "next/headers";
import { ACCESS_COOKIE, hasAccess } from "@/lib/access";
import { listPhotos, savePhoto } from "@/lib/photos";

const denied = () => Response.json({ error: "Brak dostępu" }, { status: 401 });

export async function GET() {
  if (!hasAccess((await cookies()).get(ACCESS_COOKIE)?.value)) return denied();
  return Response.json({ photos: await listPhotos() });
}

export async function POST(request: Request) {
  if (!hasAccess((await cookies()).get(ACCESS_COOKIE)?.value)) return denied();
  const file = (await request.formData()).get("photo");
  if (!(file instanceof File)) return Response.json({ error: "Brak pliku" }, { status: 400 });
  try {
    return Response.json({ photo: await savePhoto(file) }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "Nie udało się zapisać" }, { status: 422 });
  }
}
