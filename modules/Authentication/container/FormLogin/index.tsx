import { useForm } from 'react-hook-form';
import { Button, IconButton } from '@chakra-ui/button';
import { Flex, Box, useToast, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';

import AuthenticationService from '@Authentication/services/AuthenticationService';
import User from '@Authentication/interfaces/User.interface';
import { useUser } from '@Modules/Authentication/context/UserContext';
import { Input } from '@Components';

const FormLogin = () => {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const Router = useRouter();
  const { userId, setUserId } = useUser();

  useEffect(() => {
    if (userId) {
      Router.replace('/');
    }
  }, [Router, userId]);

  const onSubmit = async values => {
    try {
      const { uid } = (await AuthenticationService.signIn(values?.email, values?.password)) as User;
      if (uid) {
        setUserId(uid);
        Router.replace('/');
      }
    } catch (err) {
      toast({
        description: err.message,
        status: 'error',
      });
    }
  };

  const onLoginWithGoogle = async values => {
    try {
      const res = await AuthenticationService.signInWithGoogle();
      console.log(res);
      const { uid } = res.user;
      if (uid) {
        setUserId(uid);
        Router.replace('/');
      }
    } catch (err) {
      toast({
        description: err.message,
        status: 'error',
      });
    }
  };

  return (
    <Box margin="10px" padding="10px" borderRadius="lg" maxW={450} p="8">
      <Button onClick={onLoginWithGoogle} variant="outline" marginLeft="10px">
        <Flex mr={2}>
          <FcGoogle />
        </Flex>{' '}
        Sign in with Google
      </Button>
    </Box>
  );
};

export default FormLogin;
