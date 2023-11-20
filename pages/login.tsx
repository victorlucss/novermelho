import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';

import { FormLoginContainer } from '@Authentication/container/FormLogin/form-login.container';

export default function Home() {
  const router = useRouter();

  return (
    <Box margin="10" justify="center" align="center">
      <FormLoginContainer />
    </Box>
  );
}
