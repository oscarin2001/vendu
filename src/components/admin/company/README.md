# Company Components Architecture

Estructura profesional y escalable para los componentes de empresa.

## 📁 Estructura de Carpetas

```
src/components/admin/company/
├── forms/              # Formularios
│   ├── CompanyForm.tsx
│   ├── components/
│   │   ├── CompanyAuditInfo.tsx
│   │   ├── CompanyFormFields.tsx
│   │   └── index.ts
│   └── hooks/
│       ├── useCompanyForm.ts
│       └── index.ts
├── modals/             # Modales/Dialogs
│   ├── CompanyDetailsModal.tsx
│   ├── CompanyEditModal.tsx
│   ├── components/
│   │   ├── CompanyDetailsHeader.tsx
│   │   ├── CompanyBasicInfoCard.tsx
│   │   ├── CompanyAuditCard.tsx
│   │   ├── CompanySubscriptionCard.tsx
│   │   └── index.ts
│   └── hooks/          # Futuro: hooks específicos de modales
├── cards/              # Cards/Tarjetas de información
│   ├── CompanyOverview.tsx
│   ├── SubscriptionCard.tsx
│   └── components/     # Futuro: subcomponentes de cards
├── metrics/            # Componentes de métricas/dashboard
│   ├── CompanyMetrics.tsx
│   ├── components/
│   │   ├── MetricCard.tsx
│   │   └── index.ts
│   └── hooks/          # Futuro: hooks de métricas
├── pages/              # Páginas/vistas principales
│   └── CompanyManagement.tsx
└── shared/             # Componentes compartidos
    ├── components/     # Componentes reutilizables
    └── hooks/          # Hooks compartidos
```

## 🎯 Principios de Organización

### 1. **Separación por Responsabilidad**

- `forms/`: Todo relacionado con formularios y entrada de datos
- `modals/`: Diálogos y modales
- `cards/`: Componentes de presentación de información
- `metrics/`: Dashboard y métricas
- `pages/`: Páginas completas y layouts
- `shared/`: Utilidades compartidas

### 2. **Fragmentación de Código**

- Máximo **150 líneas por archivo**
- Componentes divididos en subcomponentes lógicos
- Lógica extraída a custom hooks
- Imports limpios con barrel exports (`index.ts`)

### 3. **Reutilización y Mantenibilidad**

- Componentes pequeños y enfocados
- Props interfaces bien definidas
- TypeScript estricto
- Patrón consistente en toda la estructura

## 🔧 Patrones Implementados

### Custom Hooks

```tsx
// Extrae lógica de estado y efectos
export function useCompanyForm({ initialData }) {
  // Estado del formulario
  // Validaciones
  // Handlers
  return { formData, handleChange, resetForm };
}
```

### Component Composition

```tsx
// Componentes compuestos de subcomponentes
export function CompanyDetailsModal({ company }) {
  return (
    <Dialog>
      <CompanyDetailsHeader />
      <CompanyBasicInfoCard company={company} />
      <CompanyAuditCard company={company} />
    </Dialog>
  );
}
```

### Barrel Exports

```tsx
// index.ts facilita imports limpios
export { CompanyAuditInfo } from "./CompanyAuditInfo";
export { CompanyFormFields } from "./CompanyFormFields";
```

## 📈 Beneficios

- **Escalabilidad**: Fácil agregar nuevas funcionalidades
- **Mantenibilidad**: Código organizado y fácil de encontrar
- **Reutilización**: Componentes modulares
- **Testing**: Componentes pequeños son más fáciles de testear
- **Developer Experience**: Estructura clara y predecible

## 🚀 Próximos Pasos

- Agregar hooks específicos en `shared/hooks/`
- Crear componentes base reutilizables
- Implementar testing para componentes críticos
- Agregar Storybook para documentación visual
