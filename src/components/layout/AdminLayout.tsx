import type { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="cms-admin cms-admin-shell">
      <Sidebar />
      <main className="cms-admin-main">
        <div className="cms-admin-content">{children}</div>
      </main>
    </div>
  );
}
