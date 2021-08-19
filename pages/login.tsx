import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/react';

import FormLogin from '@Modules/Authentication/container/FormLogin';

export default function Home() {
  const router = useRouter();

  return (
    <Box margin="10">
      <FormLogin />
    </Box>
  );
}
