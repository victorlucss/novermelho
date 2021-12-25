import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';

import FormForgotPassword from '@Authentication/container/FormForgotPassword';

export default function Home() {
  const router = useRouter();

  return (
    <Box margin="10" justify="center" align="center">
      <FormForgotPassword />
    </Box>
  );
}
