import { useRouter } from 'next/router';

import FormBill from '@Modules/Bill/container/FormBill';
import withLateralMenu from '@/hoc/withLateralMenu';

const EditBillPage = () => {
  const router = useRouter();
  const billId: string = String(router.query.billId);
  return (
    <div>
      <FormBill billId={billId} />
    </div>
  );
};

export default withLateralMenu(EditBillPage);
