import { NextResponse } from "next/server";
import mammoth from "mammoth";

export const runtime = "nodejs";

async function extractPdfText(buffer) {
  const { default: PDFParser } = await import("pdf2json");
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    pdfParser.on("pdfParser_dataError", (err) => reject(err));
    pdfParser.on("pdfParser_dataReady", () => {
      resolve(pdfParser.getRawTextContent());
    });
    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume");

    if (!file) {
      return NextResponse.json(
        { error: "Resume file is required" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = file.name.toLowerCase();

    let resumeText = "";

    if (fileName.endsWith(".pdf")) {
      resumeText = await extractPdfText(buffer);
    } else if (fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      resumeText = result.value || "";
    } else {
      return NextResponse.json(
        { error: "Unsupported format. Upload PDF or DOCX." },
        { status: 400 }
      );
    }

    const cleanedText = resumeText
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/----------------Page/g, "")
      .trim();

    console.log("✅ Resume parsed successfully");
    console.log("📄 First 300 chars:", cleanedText.slice(0, 300));
    console.log("📏 Total length:", cleanedText.length);

    if (cleanedText.length < 50) {
      return NextResponse.json(
        { error: "Resume appears empty or unreadable. Try a different file." },
        { status: 400 }
      );
    }

    return NextResponse.json({ resumeText: cleanedText });

  } catch (error) {
    console.log("PARSE RESUME ERROR:", error);
    return NextResponse.json(
      { error: "Failed to parse resume" },
      { status: 500 }
    );
  }
}
