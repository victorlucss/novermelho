
import { useRouter } from 'next/router';

import ListBills from '../modules/Bill/container/ListBills'
import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/react'
import withAuth from '@/hoc/withAuth';

const Dashboard = () => {
  const router = useRouter();

  return (
    <Box margin="10">
      <Button marginBottom="5" onClick={() => router.push('bill')}>Create new bill</Button>
      <ListBills />
    </Box>
  )
}

export default withAuth(Dashboard);
