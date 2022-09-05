import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import { billsCollection } from '@Modules/Bill/constants/FirestoreCollections';
import { Bill } from '@Modules/Bill/interfaces/Bill.interface';
import BillItem from '@Modules/Bill/components/BillItem';
import BillFilters from '@Modules/Bill/components/BillFilters';
import StateMonth from '@Modules/Bill/components/StateMonth';
import { useUser } from '@Modules/Authentication/context/UserContext';

const ListBills = () => {
  const { userId } = useUser();

  const [bills, setBills] = useState<Bill[]>([]);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  const loadBills = useCallback(() => {
    if (!userId) return;

    billsCollection.where('userId', '==', userId).onSnapshot(({ docs }) => {
      setBills(docs.map(bill => ({ id: bill.id, ...bill.data() } as Bill)));
    });
  }, [filters]);

  useEffect(() => {
    loadBills();
  }, [filters]);

  useEffect(() => {
    loadBills();
  }, []);

  const onChange = (target, value) => {
    setFilters(oldFilters => ({
      ...oldFilters,
      [target]: value,
    }));
  };

  const toast = useToast();

  return (
    <div>
      <BillFilters filters={filters} onChange={(target, value) => onChange(target, value)} from={2020} to={2024} />

      <StateMonth bills={bills} />

      {bills.map(bill => (
        <BillItem key={bill.id} bill={bill} />
      ))}
    </div>
  );
};

export default ListBills;
