"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function FooterContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState("submitting");
    setMessage("");

    const response = await fetch("/api/forms/footer-contact/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        subject: "Mensaje desde footer",
        message: formData.get("message"),
        source_page: window.location.pathname,
        data: Object.fromEntries(formData.entries()),
      }),
    });

    const data = (await response.json().catch(() => ({}))) as { message?: string; error?: string };
    if (response.ok) {
      form.reset();
      setState("success");
      setMessage(data.message || "Gracias, recibimos tu mensaje.");
      return;
    }

    setState("error");
    setMessage(data.error || "No se pudo enviar el mensaje. Intentalo de nuevo.");
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__row">
        <div>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            className="contact-form__input"
            name="name"
            type="text"
            placeholder="Nombre"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Correo electronico *</label>
          <input
            id="email"
            className="contact-form__input"
            name="email"
            type="email"
            placeholder="Correo electronico *"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="telefono">Numero de telefono</label>
        <input
          id="telefono"
          className="contact-form__input"
          name="phone"
          type="tel"
          placeholder="Numero de telefono"
          required
        />
      </div>
      <div>
        <label htmlFor="comentario">Comentario</label>
        <textarea
          id="comentario"
          className="contact-form__textarea"
          name="message"
          placeholder="Comentario"
          required
        />
      </div>
      <button className="contact-form__submit" type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Enviando..." : "Enviar"}
      </button>
      {message ? (
        <p className={`contact-form__status contact-form__status--${state}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
