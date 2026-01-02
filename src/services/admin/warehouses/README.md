# 🏗️ Warehouse Services - SaaS Multi-Tenant Architecture

## 📁 Estructura Profesional

Esta carpeta implementa una arquitectura **multi-tenant SaaS** limpia y escalable para la gestión de warehouses (bodegas).

## 🗂️ Organización por Responsabilidades

### 🔍 `queries/` - Operaciones de Lectura
- **`get-warehouses.ts`** - Obtener todos los warehouses de un tenant
- **`get-warehouse.ts`** - Obtener un warehouse específico por ID

### ✏️ `mutations/` - Operaciones de Escritura
- **`create-warehouse.ts`** - Crear nuevo warehouse
- **`update-warehouse.ts`** - Actualizar warehouse existente
- **`delete-warehouse.ts`** - Eliminar warehouse
- **`assign-manager.ts`** - Asignar/remover managers de warehouses
- **`assign-branch.ts`** - Asignar/remover warehouses de branches

### ✅ `validations/` - Validaciones y Reglas
- **`warehouse-schema.ts`** - Schemas Zod para validación de datos

### 📝 `types/` - Definiciones TypeScript
- **`warehouse.types.ts`** - Interfaces y tipos principales

### 🛠️ `utils/` - Utilidades y Helpers
- **`warehouse-utils.ts`** - Funciones de normalización y transformación
- **`useWarehouses.ts`** - React hook para gestión de estado

## 🔒 Multi-Tenant Security

Cada función implementa **aislamiento por tenant**:
- ✅ Validación de `tenantId` en cada operación
- ✅ Verificación de pertenencia de recursos al tenant
- ✅ Auditoría completa de todas las operaciones
- ✅ Control de permisos por tenant

## 📊 Beneficios de la Arquitectura

### Para Desarrolladores:
- **📖 Código autodocumentado** - Nombres descriptivos
- **🔧 Una función por archivo** - Máxima claridad
- **🧪 Fácil testing** - Cada función independiente
- **🚀 Desarrollo paralelo** - Sin conflictos

### Para SaaS:
- **🏢 Tenant isolation** - Seguridad garantizada
- **📈 Escalabilidad** - Agregar features sin romper
- **⚡ Performance** - Consultas optimizadas
- **🔄 Mantenibilidad** - Cambios localizados

## 🚀 Uso

```typescript
import {
  getWarehousesByCompany,
  createWarehouse,
  assignManagerToWarehouse
} from '@/services/admin/warehouses';

// Obtener warehouses
const warehouses = await getWarehousesByCompany('tenant-slug');

// Crear warehouse
const newWarehouse = await createWarehouse('tenant-slug', {
  name: 'Bodega Central',
  address: 'Calle 123',
  city: 'La Paz'
});

// Asignar manager
await assignManagerToWarehouse('tenant-slug', warehouseId, managerId);
```

## 📋 Convenciones

- **Máximo 150 líneas** por archivo
- **Funciones puras** cuando sea posible
- **Validación de entrada** en cada función
- **Auditoría completa** de operaciones críticas
- **Nombres descriptivos** en inglés
- **Documentación JSDoc** en funciones públicas

## 🔄 Migración

El archivo `warehouse-service.ts` original (568 líneas) ha sido dividido en **8 archivos especializados** manteniendo toda la lógica original intacta.