import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { product: { select: { title: true, slug: true, deliveryTime: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const product = await prisma.product.findUnique({ where: { slug: body.productSlug } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      productId: product.id,
      customerName: session.user.name ?? "",
      customerEmail: session.user.email ?? "",
      customerOrg: session.user.organization ?? body.organization ?? "",
      amount: product.price,
      status: "pending",
      notes: body.notes,
    },
  });
  return NextResponse.json({ order }, { status: 201 });
}
