import withAuth from '@/hoc/withAuth';
import { LateralMenu } from '@Components/LateralMenu';
import ListBills from '@Modules/Bill/container/ListBills';

const Dashboard = () => {
  return (
    <LateralMenu>
      <ListBills />
    </LateralMenu>
  );
};

export default withAuth(Dashboard);
