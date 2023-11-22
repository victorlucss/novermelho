import { useState, useEffect, useCallback } from 'react';

import { firestore } from '@Configs/Firebase';
import { useUser } from '@Authentication/context/UserContext';
import { BillTypes } from '@Modules/Bill/constants/Types';
import { billsCollection } from '@Configs/collections.config';

export interface IBill {
  id?: string;
  name: string;
  description?: string;
  value: number;
  type: 'INCOME' | 'EXPENSE';
  status: string;
  dueDate: number;
  createdAt: number;
  userId: string;
  category?: string;
}
interface UseBillsOptions {
  type?: string;
}
export const useBills = (options?: UseBillsOptions) => {
  const [bills, setBills] = useState<IBill[]>([]);
  const { userId } = useUser();
  const fetchBills = useCallback(async () => {
    if (!userId) return;

    const data = await billsCollection.where('userId', '==', userId).get();
    const docs = data.docs.map(
      category =>
        ({
          id: category.id,
          ...category.data(),
        } as IBill)
    );

    const processedDocs = docs.filter(item => (options?.type ? item.type === options.type : true));

    setBills(processedDocs);
  }, [setBills, userId]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  return bills;
};
