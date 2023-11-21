import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Center } from '@chakra-ui/react';

import { auth } from '@Configs/Firebase';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    auth.signOut();
    router.push('/');
  }, [router]);

  return <Center>Loading</Center>;
}
