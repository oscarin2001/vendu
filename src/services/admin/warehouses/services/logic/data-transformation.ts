import type {
  Warehouse,
  WarehouseWithRelations,
} from "../../types/entities/warehouse";

/**
 * Transform database warehouse record to domain entity
 * @param dbWarehouse - Database warehouse record
 * @returns Domain warehouse entity
 */
export function transformWarehouse(dbWarehouse: any): Warehouse {
  return {
    id: dbWarehouse.PK_warehouse,
    name: dbWarehouse.name,
    phone: dbWarehouse.phone,
    address: dbWarehouse.address,
    city: dbWarehouse.city,
    department: dbWarehouse.department,
    country: dbWarehouse.country,
    openedAt: dbWarehouse.openedAt || undefined,
    createdAt: dbWarehouse.createdAt,
    updatedAt: dbWarehouse.updatedAt || undefined,
    createdBy: dbWarehouse.createdBy
      ? {
          id: dbWarehouse.createdBy.PK_employee,
          name: `${dbWarehouse.createdBy.firstName} ${dbWarehouse.createdBy.lastName}`,
        }
      : undefined,
    updatedBy: dbWarehouse.updatedBy
      ? {
          id: dbWarehouse.updatedBy.PK_employee,
          name: `${dbWarehouse.updatedBy.firstName} ${dbWarehouse.updatedBy.lastName}`,
        }
      : undefined,
  };
}

/**
 * Transform database warehouse with relations to domain entity
 * @param dbWarehouse - Database warehouse record with relations
 * @returns Domain warehouse entity with relations
 */
export function transformWarehouseWithRelations(
  dbWarehouse: any,
): WarehouseWithRelations {
  return {
    ...transformWarehouse(dbWarehouse),
    managers: dbWarehouse.managerWarehouses.map((mw: any) => ({
      id: mw.manager.PK_employee,
      name: `${mw.manager.firstName} ${mw.manager.lastName}`,
      email: mw.manager.auth?.username,
      role: mw.manager.auth?.privilege?.privilegeCode,
    })),
    branches: dbWarehouse.warehouseBranches.map((wb: any) => ({
      id: wb.branch.PK_branch,
      name: wb.branch.name,
      address: wb.branch.address,
      isPrimary: wb.isPrimary,
    })),
  };
}

/**
 * Transform array of database warehouses to domain entities
 * @param dbWarehouses - Array of database warehouse records
 * @returns Array of domain warehouse entities
 */
export function transformWarehouses(dbWarehouses: any[]): Warehouse[] {
  return dbWarehouses.map(transformWarehouse);
}

/**
 * Transform array of database warehouses with relations to domain entities
 * @param dbWarehouses - Array of database warehouse records with relations
 * @returns Array of domain warehouse entities with relations
 */
export function transformWarehousesWithRelations(
  dbWarehouses: any[],
): WarehouseWithRelations[] {
  return dbWarehouses.map(transformWarehouseWithRelations);
}
