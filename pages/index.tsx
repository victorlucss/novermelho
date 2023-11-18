import withAuth from '@/hoc/withAuth';
import { LateralMenu } from '@Components/LateralMenu';
import { ListBillsContainer } from '@Modules/Bill/container/ListBills/list-bills.container';

const Dashboard = () => {
  return (
    <LateralMenu>
      <ListBillsContainer />
    </LateralMenu>
  );
};

export default withAuth(Dashboard);
