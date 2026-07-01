import ProductsTable from "@/components/admin/ProductsTable";
import { getProducts } from "@/lib/cms/products";
import { getCategories } from "@/lib/cms/product-categories";

export default async function ProductsPage() {
  const [items, categories] = await Promise.all([getProducts(), getCategories()]);
  const active = items.filter((p) => p.status !== "deleted");
  return (<div className="page-card"><div className="page-header"><h2>Productos</h2><a className="primary-btn" href="/admin/shop/products/new">Nuevo producto</a></div>{active.length === 0 ? <p className="muted">No hay productos aún.</p> : <ProductsTable items={active} categories={categories} />}</div>);
}
