import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch the image content from the database
    const imageContent = await prisma.imageContent.findUnique({
      where: { imageId: id },
      select: {
        data: true,
        format: true,
      },
    });

    if (!imageContent) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // Convert Buffer to appropriate format and return
    const buffer = Buffer.from(imageContent.data);
    
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": imageContent.format || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
