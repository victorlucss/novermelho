import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import { billsCollection } from '@Modules/Bill/constants/FirestoreCollections';
import { Bill } from '@Modules/Bill/interfaces/Bill.interface';
import BillItem from '@Modules/Bill/components/BillItem';
import BillFilters from '@Modules/Bill/components/BillFilters';
import { StatsMonth } from '@Modules/Bill/components/StatsMonth/stats-month.component';
import { useUser } from '@Modules/Authentication/context/UserContext';
import { BillTypes } from '@Modules/Bill/constants/Types';

export const ListBillsContainer = () => {
  const { userId } = useUser();

  const [bills, setBills] = useState<Bill[]>([]);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  const loadBills = useCallback(() => {
    if (!userId) return;

    const { year, month } = filters;
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    billsCollection
      .where('userId', '==', userId)
      .where('dueDate', '>=', startDate.getTime())
      .where('dueDate', '<=', endDate.getTime())
      .onSnapshot(({ docs }) => {
        console.log('docs', docs, filters, startDate, endDate);
        setBills(docs.map(bill => ({ id: bill.id, ...bill.data() } as Bill)));
      });
  }, [filters, userId]);

  useEffect(() => {
    loadBills();
  }, [filters, loadBills]);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  const onChange = (target, value) => {
    setFilters(oldFilters => ({
      ...oldFilters,
      [target]: value,
    }));
  };

  const toast = useToast();

  const income = useMemo(() => {
    return (
      bills.filter(bill => bill.type === BillTypes.INCOME).reduce((prev, current) => (prev += current.value), 0) ?? 0
    );
  }, [bills]);

  const expense = useMemo(() => {
    return (
      bills.filter(bill => bill.type === BillTypes.EXPENSE).reduce((prev, current) => (prev += current.value), 0) ?? 0
    );
  }, [bills]);

  return (
    <div>
      <BillFilters filters={filters} onChange={(target, value) => onChange(target, value)} from={2020} to={2024} />

      <StatsMonth income={income} expense={expense} balance={income - expense} />

      {bills.map(bill => (
        <BillItem key={bill.id} bill={bill} />
      ))}
    </div>
  );
};
