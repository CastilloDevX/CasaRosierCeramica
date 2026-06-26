import type { Metadata } from "next";
import { BodyClass } from "@/components/layout/BodyClass";
import { Footer } from "@/components/layout/Footer";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { Cart } from "@/components/shop/Cart";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Resumen del pedido de Casa Rosier."
};

export default function CartPage() {
  return (
    <>
      <BodyClass className="cart-page" />
      <HeaderInterno eyebrow="Resumen del pedido" title="Carrito" />
      <main>
        <section className="cart section">
          <div className="container cart__container">
            <Cart />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
