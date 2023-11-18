import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';

import FormSignUp from '@Modules/Authentication/container/FormSignUp';
import { auth } from '@Configs/Firebase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    auth.signOut();
    router.push('/');
  }, [router]);

  return (
    <Box margin="10" justify="center" align="center">
      Loading...
    </Box>
  );
}
