import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';

import FormSignUp from '@Modules/Authentication/container/FormSignUp';

export default function Home() {
  const router = useRouter();

  return (
    <Box  margin="10" justify="center" align="center">
      <FormSignUp />
    </Box>
  );
}
