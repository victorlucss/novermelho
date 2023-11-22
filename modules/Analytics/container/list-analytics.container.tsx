import { MonthByMonth } from '@Modules/Analytics/components/month-by-month.component';
import { CategoriesCurrentMonth } from '@Modules/Analytics/components/categories-current-month.component';
import { useCategories } from '@/hooks/useCategories';
import { useBills } from '@/hooks/useBills';
import { BillTypes } from '@Modules/Bill/constants/Types';

export const ListAnalyticsContainer = () => {
  const categories = useCategories();
  const bills = useBills();
  const billsExpesne = bills.filter(bill => bill.type === BillTypes.EXPENSE);

  return (
    <>
      <MonthByMonth bills={bills} />
      <CategoriesCurrentMonth categories={categories} bills={billsExpesne} />
    </>
  );
};
