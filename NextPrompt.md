Ahora vamos a Componentes > Banners Promocionales. http://localhost:3000/admin/components/promo-banners en la sección directa de: 
```html
<section class="promo-activation-panel" aria-label="Estado de activación de banners"><div><p class="auth-kicker">Banner activo</p><h3>Un Banner Nuevo</h3><p>Solo este banner se mostrará en el home. Activar otro archivará este automáticamente.</p></div><span class="promo-activation-panel__status is-on"><span class="material-symbols-outlined" aria-hidden="true">radio_button_checked</span>1 activo</span></section>
```
se tendrá que eliminar, no tiene mucho sentido.

Los filtros tienen qué funcionar, vas a quitar el componente Archivado, ya que solo existen 2 estados "Archivado" o "Borrador", por el momento no funcionan estos filtros, deberás corregirlos.

Ahora en la lista de Banners el Texto de "Eliminar" lo vas a sustituir por "Papelera"