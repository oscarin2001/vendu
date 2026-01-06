export interface SalesData {
  id: string;
  orderId: string;
  branchId: string;
  employeeId: string;
  total: number;
  date: Date;
  status: "completed" | "pending" | "cancelled";
}

export interface SalesMetrics {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  salesByDay: Array<{
    date: string;
    amount: number;
  }>;
  salesByBranch: Array<{
    branchName: string;
    amount: number;
  }>;
  salesByEmployee: Array<{
    employeeName: string;
    amount: number;
  }>;
}
