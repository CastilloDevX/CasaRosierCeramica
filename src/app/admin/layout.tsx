import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireAdminProfile } from "@/lib/auth/supabase-auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requireAdminProfile();
  if (!session) redirect("/auth");

  return (
    <>
      {/* Material Symbols has no next/font equivalent and is only needed by the CMS. */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
