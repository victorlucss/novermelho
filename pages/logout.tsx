import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { auth } from '@Configs/Firebase';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    auth.signOut();
    router.push('/');
  }, []);

  return <>Loading</>;
}
