import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/services/auth/redirection-handler";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const country = String(body.country || "").trim();
    const department = body.department ? String(body.department) : undefined;
    const commerceType = body.commerceType
      ? String(body.commerceType)
      : undefined;
    const description = body.description ? String(body.description) : undefined;
    const vision = body.vision ? String(body.vision) : undefined;
    const mission = body.mission ? String(body.mission) : undefined;
    const openedAt = body.openedAt ? String(body.openedAt) : undefined;
    const tosAccepted = !!body.tosAccepted;
    const tosRead = !!body.tosRead;

    if (!name || !country || !openedAt) {
      return NextResponse.json(
        { success: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const existingNames = await prisma.tbcompanies.findMany({
      select: { name: true },
    });
    const normalizedName = name.toLocaleLowerCase();
    const hasInsensitiveMatch = existingNames.some(
      (item) => item.name.toLocaleLowerCase() === normalizedName
    );

    if (hasInsensitiveMatch) {
      return NextResponse.json(
        { success: false, error: "Ya existe una empresa con ese nombre" },
        { status: 409 }
      );
    }

    const slug = await generateUniqueSlug(name);

    const xff = req.headers.get("x-forwarded-for") || "";
    const ip = (xff.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      undefined) as string | undefined;
    const ua = (req.headers.get("user-agent") || undefined) as
      | string
      | undefined;

    const company = await prisma.tbcompanies.create({
      data: {
        name,
        country,
        department,
        commerceType,
        description,
        vision,
        mission,
        openedAt: openedAt ? new Date(openedAt) : undefined,
        tosRead,
        tosReadAt: tosRead ? new Date() : undefined,
        tosAccepted,
        tosAcceptedAt: tosAccepted ? new Date() : undefined,
        tosAcceptedIp: ip,
        tosAcceptedUa: ua,
        slug,
      } as any,
    });

    return NextResponse.json({ success: true, company });
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json(
          {
            success: false,
            error:
              "Ya existe una empresa con ese nombre (sin distinguir mayúsculas/minúsculas)",
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: err.message || "Error" },
      { status: 500 }
    );
  }
}
