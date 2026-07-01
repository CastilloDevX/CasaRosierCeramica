"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Switch from "@/components/ui/Switch";
import RichTextField from "./RichTextField";
import type { ClassOfferingContent, ClassOfferingModule } from "@/lib/cms/types";

interface ClassContentTabProps {
  content: ClassOfferingContent;
  onChange: (content: ClassOfferingContent) => void;
  onDirty: () => void;
}

function defaultContent(): ClassOfferingContent {
  return {
    learningSectionTitle: "",
    learningContent: "",
    participationSectionTitle: "",
    participationContent: "",
    paymentMethods: "",
    contactWhatsapp: "",
    contactEmail: "",
    extraInfo: "",
    showEnrollButtonAtEnd: true,
    activitiesSection: { enabled: false, title: "", content: "", items: [] },
    modulesSectionTitle: "",
    modulesAccordionTitle: "",
    modules: [],
  };
}

function createModuleId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `mod-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createActivityId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `act-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function FieldLabel({ children }: { children: string }) {
  return (
    <label className="text-label-md font-bold uppercase tracking-wide text-on-surface-variant">
      {children}
    </label>
  );
}

function TextField({
  label,
  help,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; help?: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <input
        {...props}
        className={`block w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary-container ${
          error ? "border-error" : "border-outline-variant"
        }`}
      />
      {help && !error ? <p className="text-label-md text-on-surface-variant/70">{help}</p> : null}
      {error ? <p className="text-label-md text-error">{error}</p> : null}
    </div>
  );
}

function TextAreaField({
  label,
  error,
  help,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; help?: string }) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        {...props}
        className={`block min-h-[110px] w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary-container ${
          error ? "border-error" : "border-outline-variant"
        } ${props.className ?? ""}`}
      />
      {help && !error ? <p className="text-label-md text-on-surface-variant/70">{help}</p> : null}
      {error ? <p className="text-label-md text-error">{error}</p> : null}
    </div>
  );
}

function InfoBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-secondary-container/40 bg-secondary-container/10 p-5 text-body-md text-on-surface">
      {children}
    </div>
  );
}

export { defaultContent, type ClassOfferingContent };

export default function ClassContentTab({ content, onChange, onDirty }: ClassContentTabProps) {
  const [activitiesOpen, setActivitiesOpen] = useState(content.activitiesSection.enabled);

  function update(field: keyof ClassOfferingContent, value: unknown) {
    onChange({ ...content, [field]: value });
    onDirty();
  }

  function updateModule(index: number, next: Partial<ClassOfferingModule>) {
    const modules = content.modules.map((item, i) => (i === index ? { ...item, ...next } : item));
    update("modules", modules);
  }

  function addModule() {
    const modules = [
      ...content.modules,
      { id: createModuleId(), title: `MÓDULO ${content.modules.length + 1}.`, description: "", order: content.modules.length },
    ];
    update("modules", modules);
  }

  function duplicateModule(index: number) {
    const current = content.modules[index];
    if (!current) return;
    const modules = [
      ...content.modules.slice(0, index + 1),
      { ...current, id: createModuleId(), title: current.title ? `${current.title} (copia)` : "", order: index + 1 },
      ...content.modules.slice(index + 1),
    ].map((item, order) => ({ ...item, order }));
    update("modules", modules);
  }

  function removeModule(index: number) {
    if (!window.confirm("¿Eliminar este módulo?")) return;
    const modules = content.modules.filter((_, i) => i !== index).map((item, order) => ({ ...item, order }));
    update("modules", modules);
  }

  function addActivityItem() {
    const items = [
      ...content.activitiesSection.items,
      { id: createActivityId(), title: "", description: "", image: "", order: content.activitiesSection.items.length },
    ];
    onChange({ ...content, activitiesSection: { ...content.activitiesSection, items } });
    onDirty();
  }

  function updateActivityItem(index: number, next: Partial<ClassOfferingModule>) {
    const items = content.activitiesSection.items.map((item, i) => (i === index ? { ...item, ...next } : item));
    onChange({ ...content, activitiesSection: { ...content.activitiesSection, items } });
    onDirty();
  }

  function removeActivityItem(index: number) {
    if (!window.confirm("¿Eliminar esta actividad?")) return;
    const items = content.activitiesSection.items.filter((_, i) => i !== index).map((item, order) => ({ ...item, order }));
    onChange({ ...content, activitiesSection: { ...content.activitiesSection, items } });
    onDirty();
  }

  const contactPreview = `Cualquier consulta o información adicional que necesites me puedes escribir al WhatsApp ${content.contactWhatsapp || "(teléfono no configurado)"} o al mail ${content.contactEmail || "(email no configurado)"}`;

  return (
    <div className="space-y-6">
      {/* ── Bloque principal: Contenido del Curso ── */}
      <Card padding="lg" className="space-y-5 rounded-2xl">
        <h2 className="text-headline-sm text-on-surface">Contenido del Curso</h2>

        <TextField
          label="Título de la sección '¿Qué aprenderás?'"
          value={content.learningSectionTitle}
          placeholder="Estructura por módulos"
          onChange={(event) => update("learningSectionTitle", event.target.value)}
        />

        <RichTextField
          label="¿Qué aprenderás?"
          value={content.learningContent}
          onChange={(value) => update("learningContent", value)}
          minHeight="200px"
          placeholder="Módulo 1. Arcillas y propiedades de la materia cerámica.&#10;Módulo 2. Modelado manual y técnicas constructivas básicas."
        />

        <TextField
          label="Título de la sección '¿Quién puede participar?'"
          value={content.participationSectionTitle}
          placeholder="QUE INCLUYE"
          onChange={(event) => update("participationSectionTitle", event.target.value)}
        />

        <RichTextField
          label="¿Quién puede participar?"
          value={content.participationContent}
          onChange={(value) => update("participationContent", value)}
          minHeight="200px"
          placeholder="Materiales básicos para cada clase (arcillas, engobes, esmaltes comerciales).&#10;Uso de herramientas y horno durante las sesiones presenciales."
        />

        <TextField
          label="Formas de pago"
          value={content.paymentMethods}
          placeholder="ej: Transferencia, tarjeta, efectivo, Bizum"
          onChange={(event) => update("paymentMethods", event.target.value)}
        />

        <InfoBlock>
          <p className="mb-4 text-label-md font-semibold text-secondary">
            Este bloque muestra un mensaje de contacto estándar. Personaliza tu teléfono y email:
          </p>
          <div className="space-y-4">
            <TextField
              label="Teléfono WhatsApp"
              type="tel"
              value={content.contactWhatsapp}
              placeholder="645690324"
              error={content.contactWhatsapp && !/^\d+$/.test(content.contactWhatsapp) ? "Usa solo números" : undefined}
              onChange={(event) => update("contactWhatsapp", event.target.value)}
            />
            <TextField
              label="Email de contacto"
              type="email"
              value={content.contactEmail}
              placeholder="info@casarosierceramica.com"
              error={content.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.contactEmail) ? "Email no válido" : undefined}
              onChange={(event) => update("contactEmail", event.target.value)}
            />
          </div>
          <div className="mt-4 rounded-lg bg-white/60 p-4">
            <p className="text-label-md font-semibold text-on-surface">Vista previa:</p>
            <p className="mt-1 text-body-md text-on-surface-variant">{contactPreview}</p>
          </div>
        </InfoBlock>

        <TextAreaField
          label="Información extra (opcional)"
          value={content.extraInfo}
          placeholder="Añade información adicional si es necesaria..."
          onChange={(event) => update("extraInfo", event.target.value)}
        />

        <Switch
          checked={content.showEnrollButtonAtEnd}
          label="Mostrar botón “Inscribirse” al final del contenido"
          description="Este botón aparece después de la sección de contenido, módulos y actividades."
          onCheckedChange={(checked) => update("showEnrollButtonAtEnd", checked)}
        />
      </Card>

      {/* ── Bloque colapsable: Actividades ── */}
      <Card padding="lg" className="space-y-5 rounded-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-headline-sm text-on-surface">¿Qué tipo de actividades pueden hacer?</h2>
          <div className="w-full max-w-[220px]">
            <Switch
              checked={activitiesOpen}
              label="Mostrar sección"
              onCheckedChange={(checked) => {
                setActivitiesOpen(checked);
                onChange({ ...content, activitiesSection: { ...content.activitiesSection, enabled: checked } });
                onDirty();
              }}
              className="py-3"
            />
          </div>
        </div>

        {activitiesOpen ? (
          <div className="space-y-5">
            <TextField
              label="Título de sección"
              value={content.activitiesSection.title}
              placeholder="ej: Actividades prácticas"
              onChange={(event) => { onChange({ ...content, activitiesSection: { ...content.activitiesSection, title: event.target.value } }); onDirty(); }}
            />
            <TextAreaField
              label="Contenido"
              value={content.activitiesSection.content}
              placeholder="Describe las actividades que se pueden realizar..."
              onChange={(event) => { onChange({ ...content, activitiesSection: { ...content.activitiesSection, content: event.target.value } }); onDirty(); }}
              className="min-h-[120px]"
            />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FieldLabel>Lista de actividades</FieldLabel>
                <Button type="button" variant="outlined" size="sm" onClick={addActivityItem}>+ Añadir actividad</Button>
              </div>
              {content.activitiesSection.items.length === 0 ? (
                <p className="text-body-md text-on-surface-variant">No hay actividades añadidas.</p>
              ) : (
                content.activitiesSection.items.map((item, index) => (
                  <div key={item.id} className="rounded-xl border border-outline-variant p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-label-md font-bold text-on-surface">Actividad {index + 1}</span>
                      <button type="button" onClick={() => removeActivityItem(index)} className="text-error hover:text-error/80">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    <div className="space-y-3">
                      <TextField label="Título" value={item.title} onChange={(event) => updateActivityItem(index, { title: event.target.value })} />
                      <TextAreaField label="Descripción" value={item.description} onChange={(event) => updateActivityItem(index, { description: event.target.value })} className="min-h-[80px]" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}
      </Card>

      {/* ── Bloque: Módulos del Curso ── */}
      <Card padding="lg" className="space-y-5 rounded-2xl">
        <h2 className="text-headline-sm text-on-surface">Módulos del Curso</h2>

        <TextField
          label="Título de la sección 'Contenido del curso'"
          value={content.modulesSectionTitle}
          placeholder="programa del curso"
          onChange={(event) => update("modulesSectionTitle", event.target.value)}
        />

        <InfoBlock>
          <FieldLabel>Título del acordeón principal</FieldLabel>
          <input
            value={content.modulesAccordionTitle}
            onChange={(event) => update("modulesAccordionTitle", event.target.value)}
            placeholder="Ver programa completo"
            className="mt-2 block w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary-container"
          />
          <p className="mt-2 text-label-md text-on-surface-variant/70">Este título aparece en el acordeón que agrupa todos los módulos</p>
        </InfoBlock>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FieldLabel>Módulos</FieldLabel>
            <Button type="button" variant="outlined" size="sm" onClick={addModule}>+ Añadir módulo</Button>
          </div>

          {content.modules.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-secondary-container bg-secondary-container/10 px-6 py-12 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-lowest text-secondary shadow-sm">
                <span className="material-symbols-outlined text-3xl">menu_book</span>
              </span>
              <h3 className="text-title-md font-bold text-on-surface">No hay módulos creados todavía.</h3>
              <Button type="button" variant="outlined" className="mt-4 border-secondary-container text-secondary" onClick={addModule}>
                + Añadir módulo
              </Button>
            </div>
          ) : (
            content.modules.map((mod, index) => (
              <div key={mod.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-label-md font-bold uppercase tracking-wide text-on-surface-variant">Módulo {index + 1}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => duplicateModule(index)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-lg">content_copy</span>
                      Duplicar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeModule(index)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-label-md font-semibold text-error transition-colors hover:bg-error-container"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <TextField
                    label={`Módulo ${index + 1}`}
                    value={mod.title}
                    placeholder={`MÓDULO ${index + 1}. TÍTULO DEL MÓDULO`}
                    onChange={(event) => updateModule(index, { title: event.target.value })}
                  />
                  <TextAreaField
                    label="Descripción del módulo"
                    value={mod.description}
                    placeholder="Objetivo: comprender la naturaleza técnica de las arcillas..."
                    onChange={(event) => updateModule(index, { description: event.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
