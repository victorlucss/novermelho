import { Button } from '@chakra-ui/button';
import { Flex, Box, useToast, Text, Spacer, Image, AbsoluteCenter } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';

import { signInWithGoogle } from '@Authentication/services/authentication.service';
import { useUser } from '@Modules/Authentication/context/UserContext';

export const FormLoginContainer = () => {
  const toast = useToast();
  const router = useRouter();
  const { userId, setUserId } = useUser();

  useEffect(() => {
    if (userId) {
      router.push('/');
    }
  }, [router, userId]);

  const onLoginWithGoogle = async () => {
    try {
      const uid = await signInWithGoogle();

      if (uid) {
        setUserId(uid);
        router.push('/');
      }
    } catch (err) {
      toast({
        description: err.message,
        status: 'error',
      });
    }
  };

  return (
    <AbsoluteCenter>
      <Box margin="10px" borderWidth="1px" padding="10px" borderRadius="lg" maxW={500} p="4" pt={8} pb={8}>
        <Image src="/logo.png" width={35} height={35} />
        <Spacer mb={5} />
        <Text fontSize="sm">Desbrave o caminho para a estabilidade financeira e saia do vermelho.</Text>
        <Spacer mb={5} />
        <Button onClick={onLoginWithGoogle} variant="outline" marginLeft="10px">
          <Flex mr={2}>
            <FcGoogle />
          </Flex>
          Login com Google
        </Button>
      </Box>
    </AbsoluteCenter>
  );
};
