export interface FinancialData {
  id: string;
  branchId: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: Date;
  category: string;
}

export interface PaymentData {
  id: string;
  orderId: string;
  amount: number;
  method: 'cash' | 'card' | 'transfer' | 'digital';
  status: 'completed' | 'pending' | 'failed';
  date: Date;
}

export interface FinancialMetrics {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  cashFlow: number;
  pendingPayments: number;
  completedPayments: number;
  paymentMethods: Array<{
    method: string;
    count: number;
    amount: number;
  }>;
}