import { NextResponse, type NextRequest } from "next/server";
import { getFormBySlug } from "@/lib/cms/forms";
import { createFormSubmission } from "@/lib/cms/form-submissions";

async function readSubmissionBody(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject") || "Mensaje desde footer",
    message: formData.get("message"),
    source_page: formData.get("source_page") || "",
    data: Object.fromEntries(formData.entries()),
  };
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const form = await getFormBySlug((await ctx.params).slug);
  if (!form || form.status !== "active") return NextResponse.json({ error: "Formulario no encontrado o inactivo." }, { status: 404 });
  const body = await readSubmissionBody(request);
  if (!body?.name || !body?.email) return NextResponse.json({ error: "Nombre y email obligatorios." }, { status: 400 });
  const submission = await createFormSubmission({
    form_id: form.id,
    form_slug: form.slug,
    form_name: form.name,
    name: body.name,
    email: body.email,
    phone: body.phone || "",
    subject: body.subject || "",
    message: body.message || "",
    data: body.data || body,
    source_page: body.source_page || "",
    status: "new",
  });
  return NextResponse.json({ ok: true, message: form.success_message || "Mensaje enviado correctamente.", submission_id: submission.id });
}
