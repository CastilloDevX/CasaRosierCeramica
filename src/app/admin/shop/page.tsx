import Link from "@/components/admin/AdminLink";
import ShopOverviewCards from "@/components/admin/ShopOverviewCards";
import { getProducts } from "@/lib/cms/products";
import { getOrders } from "@/lib/cms/orders";

export default async function ShopPage() {
  const [allProducts, orders] = await Promise.all([getProducts(), getOrders()]);
  const lowStock = allProducts.filter((p) => p.stock !== null && p.stock <= (p.low_stock_threshold || 5) && p.status !== "deleted");
  const publishedProducts = allProducts.filter((p) => p.status === "published").length;
  const newOrders = orders.filter((o) => o.status === "new").length;
  const totalSales = orders.filter((o) => o.payment_status === "paid").reduce((sum, o) => sum + (o.total ?? 0), 0);
  return (
    <div className="page-card">
      <div className="page-header"><h2>Shop</h2></div>
      <ShopOverviewCards stats={{ publishedProducts, lowStock: lowStock.length, newOrders, totalSales }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
        <Link href="/admin/shop/products" className="stat-card" style={{ textDecoration: "none", cursor: "pointer" }}><p className="auth-kicker">Productos</p><p style={{ fontWeight: 500 }}>Gestionar catálogo</p></Link>
        <Link href="/admin/shop/categories" className="stat-card" style={{ textDecoration: "none", cursor: "pointer" }}><p className="auth-kicker">Categorías</p><p style={{ fontWeight: 500 }}>Gestionar categorías</p></Link>
        <Link href="/admin/shop/orders" className="stat-card" style={{ textDecoration: "none", cursor: "pointer" }}><p className="auth-kicker">Pedidos</p><p style={{ fontWeight: 500 }}>Ver pedidos</p></Link>
        <Link href="/admin/shop/coupons" className="stat-card" style={{ textDecoration: "none", cursor: "pointer" }}><p className="auth-kicker">Cupones</p><p style={{ fontWeight: 500 }}>Gestionar descuentos</p></Link>
        <Link href="/admin/shop/shipping" className="stat-card" style={{ textDecoration: "none", cursor: "pointer" }}><p className="auth-kicker">Envíos</p><p style={{ fontWeight: 500 }}>Configurar envíos</p></Link>
      </div>
    </div>
  );
}
