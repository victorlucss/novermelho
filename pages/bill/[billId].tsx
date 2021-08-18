import FormBill from '@Modules/Bill/container/FormBill'
import { useRouter } from 'next/router'

export default function EditBillPage() {

  const router = useRouter();
  const billId: string = String(router.query.billId)
  return (
    <div>
      <FormBill billId={billId} />
    </div>
  )
}
