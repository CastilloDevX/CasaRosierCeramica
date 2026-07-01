import AdminShell from "@/components/admin/AdminShell";
import MarketingForm from "@/components/admin/MarketingForm";

export default function MarketingPage() {
  return (
    <AdminShell>
      <div className="page-card">
        <div className="page-header">
          <div>
            <p className="auth-kicker">CMS</p>
            <h2>Marketing y analíticas</h2>
            <p className="muted">Gestiona medición, píxeles, SEO técnico y eventos.</p>
          </div>
        </div>
        <MarketingForm />
      </div>
    </AdminShell>
  );
}
