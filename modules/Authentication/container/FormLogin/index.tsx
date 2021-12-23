import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/button';
import { Flex, Box, useToast, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect } from 'react';

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
  }, [userId]);

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

  return (
    <Box margin="10px" padding="10px" borderRadius="lg" maxW={450} bg="white" p="8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" alignItems="flex-start">
          <Input
            type="email"
            name="email"
            label="Email"
            {...register('email', { required: true })}
            error={errors.email?.message}
            marginBottom="10px"
          />
          <Box w="100%">
            <Input
              type="password"
              name="password"
              label="Password"
              {...register('password')}
              error={errors.password?.message}
              marginBottom="10px"
            />
            <Box textAlign="left" mt="-2">
              <Link passHref href="forgot">
                <Button variant="link" fontSize="smaller">
                  Forgot password
                </Button>
              </Link>
            </Box>
          </Box>

          <Box w="100%" mt="4">
            <Button type="submit" colorScheme="red" isFullWidth isLoading={isSubmitting}>
              Login
            </Button>
            <Flex flex="1" justify="center" mt="4">
              <Text>Not registered yet?</Text>
              <Link passHref href="signup">
                <Button variant="link" marginLeft="10px">
                  Sign up here
                </Button>
              </Link>
            </Flex>
          </Box>
        </Flex>
      </form>
    </Box>
  );
};

export default FormLogin;
