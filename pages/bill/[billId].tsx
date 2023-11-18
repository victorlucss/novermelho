import { useRouter } from 'next/router';

import { FormBillContainer } from '@Modules/Bill/container/FormBill/form-bill.container';
import withLateralMenu from '@/hoc/withLateralMenu';

const EditBillPage = () => {
  const router = useRouter();
  const billId: string = String(router.query.billId);
  return (
    <div>
      <FormBillContainer billId={billId} />
    </div>
  );
};

export default withLateralMenu(EditBillPage);
