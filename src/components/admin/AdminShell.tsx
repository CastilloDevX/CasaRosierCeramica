import type { ReactNode } from "react";
import AdminLayout from "@/components/layout/AdminLayout";

interface AdminShellProps {
  children: ReactNode;
  topBar?: ReactNode;
}

export default function AdminShell({ children, topBar }: AdminShellProps) {
  return <AdminLayout>{topBar}{children}</AdminLayout>;
}
