import AdminShell from "@/components/admin/AdminShell"; import FooterForm from "@/components/admin/FooterForm";

export default function Page() { return (<AdminShell><div className="section-head"><div><p className="auth-kicker">CMS</p><h2>Nuevo footer</h2></div></div><FooterForm mode="create" /></AdminShell>); }
