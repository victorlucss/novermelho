interface BillMetadata {
  quotas?: number;
  category: string;
}

export interface Bill {
  id?: string;
  name: string;
  description?: string;
  value: number;
  type: 'INCOME' | 'EXPENSE';
  status: string;
  dueDate: number;
  metadata?: BillMetadata;
  createdAt: number;
  userId: string;
  category?: string;
}
