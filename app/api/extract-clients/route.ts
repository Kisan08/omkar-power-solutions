import { NextRequest, NextResponse } from "next/server";
//import * as pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    const text = data.text;

    // Extract phone numbers and names from text
    const lines = text.split("\n").filter((l: string) => l.trim());
    const clients: { name: string; phone: string }[] = [];

    const phoneRegex = /(?:\+91|91)?[6-9]\d{9}/g;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const phones = line.match(phoneRegex);

      if (phones) {
        // Try to get name from same line or previous line
        const cleanPhone = phones[0].replace(/\D/g, "").slice(-10);
        const namePart = line
          .replace(phoneRegex, "")
          .replace(/[^a-zA-Z\s]/g, "")
          .trim();
        const name =
          namePart.length > 2
            ? namePart
            : lines[i - 1]
            ? lines[i - 1].replace(/[^a-zA-Z\s]/g, "").trim()
            : "Client";

        if (cleanPhone.length === 10) {
          clients.push({
            name: name || "Client",
            phone: cleanPhone,
          });
        }
      }
    }

    // Remove duplicates by phone
    const unique = clients.filter(
      (c, i, self) => i === self.findIndex((t) => t.phone === c.phone)
    );

    return NextResponse.json({ clients: unique, total: unique.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to parse PDF" },
      { status: 500 }
    );
  }
}