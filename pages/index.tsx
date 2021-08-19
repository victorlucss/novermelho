import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/react';

import withAuth from '@/hoc/withAuth';
import { auth } from '@Configs/Firebase';

import ListBills from '../modules/Bill/container/ListBills';

const Dashboard = () => {
  const router = useRouter();

  return (
    <Box margin="10">
      <Button marginBottom="5" onClick={() => router.push('bill')}>
        Create new bill
      </Button>

      <Button marginBottom="5" marginLeft="10px" variant="solid" onClick={() => auth.signOut()}>
        SignOut
      </Button>
      <ListBills />
    </Box>
  );
};

export default withAuth(Dashboard);
