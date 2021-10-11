import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/button';
import { Flex, Box, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect } from 'react';
import Link from 'next/link';

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
    <Box margin="10px" padding="10px" borderWidth="1px" borderRadius="lg">
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

          <Input
            type="password"
            name="password"
            label="Password"
            {...register('password')}
            error={errors.password?.message}
            marginBottom="10px"
          />

          <div>
            <Button type="submit" isLoading={isSubmitting}>
              Login
            </Button>
            <Button variant="outline" marginLeft="10px">
              Register
            </Button>
            <Link passHref href="forgot">
              <Button variant="link" marginLeft="10px">
                Forgot password
              </Button>
            </Link>
            <Link passHref href="signup">
              <Button variant="outline" marginLeft="10px">
                Register
              </Button>
            </Link>
          </div>
        </Flex>
      </form>
    </Box>
  );
};

export default FormLogin;
