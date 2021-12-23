import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/button';
import { Flex, Box, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import AuthenticationService from '@Authentication/services/AuthenticationService';
import { Input } from '@Components';

const FormForgotPassword = () => {
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const Router = useRouter();

  const onSubmit = async values => {
    try {
      const haveSentMail = await AuthenticationService.forgotPassword(values?.email);
      if (haveSentMail) {
        toast({
          description: 'An e-mail with password recovery link has been sent!',
          status: 'success',
        });

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

          <Box w="100%" mt="4">
            <Button type="submit" isFullWidth colorScheme="red" isLoading={isSubmitting}>
              Send
            </Button>
            <Button variant="link" isFullWidth  onClick={() => Router.back()}>
              Back
            </Button>
          </Box>
        </Flex>
      </form>
    </Box>
  );
};

export default FormForgotPassword;
