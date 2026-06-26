import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de Casa Rosier."
};

export default function PrivacyPage() {
  return (
    <main className="privacy">
      <h1>Política de Privacidad</h1>
      <p>
        En Casa Rosier respetamos tu privacidad y tratamos tus datos personales
        de forma responsable.
      </p>
      <h2>Datos que recopilamos</h2>
      <ul>
        <li>
          Datos de contacto enviados por formularios (nombre, email, teléfono).
        </li>
        <li>Preferencias de cookies para recordar tu elección.</li>
      </ul>
      <h2>Finalidad</h2>
      <p>
        Usamos estos datos para responder consultas, gestionar comunicaciones y
        mejorar la experiencia del sitio.
      </p>
      <h2>Conservación y seguridad</h2>
      <p>
        Mantenemos medidas razonables de seguridad y solo conservamos los datos
        durante el tiempo necesario para su finalidad.
      </p>
      <h2>Contacto</h2>
      <p>
        Si quieres ejercer derechos de acceso, rectificación o eliminación,
        escríbenos desde la sección de contacto del sitio.
      </p>
      <p>
        <Link href="/">Volver al inicio</Link>
      </p>
    </main>
  );
}
