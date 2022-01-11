import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/button';
import { useToast, Flex, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { Input } from '@Components';
import { auth } from '@Configs/Firebase';
import { useUser } from '@Modules/Authentication/context/UserContext';

const FormSignUp = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const Router = useRouter();
  const toast = useToast();
  const { setUserId } = useUser();

  const onSubmit = async values => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(values.email, values.password);

      localStorage.setItem('USER_UID', user.uid);
      setUserId(user.uid);
      Router.replace('/');

      toast({
        description: 'User successful created!',
        status: 'success',
      });
    } catch (error) {
      console.error(error);
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

          <Input
            type="password"
            name="password"
            label="Password"
            {...register('password')}
            error={errors.password?.message}
            marginBottom="10px"
          />

          <Box w="100%" mt="4">
            <Button type="submit" isFullWidth colorScheme="red" isLoading={isSubmitting}>
              Register
            </Button>
          </Box>
        </Flex>
      </form>
    </Box>
  );
};

export default FormSignUp;
