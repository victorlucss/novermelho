import { useRouter } from 'next/router';

import FormSignUp from '@Modules/Authentication/container/FormSignUp'
import { Box } from '@chakra-ui/react'

export default function Home() {
  const router = useRouter();

  return (
    <Box margin="10">
      <FormSignUp />
    </Box>
  )
}
