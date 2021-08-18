import { useForm } from "react-hook-form";

import { Input }  from '@Components'
import { Button } from '@chakra-ui/button'
import { Flex, Box } from '@chakra-ui/react'
import { auth } from '@Configs/Firebase'
import { useUser } from '@Modules/Authentication/context/UserContext'
import { useRouter } from 'next/router'
import { useEffect } from "react";

const FormLogin = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm();
  const Router = useRouter()
  const { userId, setUserId } = useUser()

  useEffect(() => {
    Router.replace('/')
  }, [userId]);

  const onSubmit = async (values) => {
    const { user } = await auth.signInWithEmailAndPassword(values?.email, values?.password)

    setUserId(user.uid)
    Router.replace('/')
  }

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
            marginBottom="10px" />

          <Input
            type="password"
            name="password"
            label="Password"
            {...register('password')}
            error={errors.password?.message}
            marginBottom="10px" />

          <div>
            <Button type="submit" isLoading={isSubmitting}>Login</Button>
            <Button variant="outline" marginLeft="10px">Register</Button>
          </div>
        </Flex>
      </form>
    </Box>
  )
}

export default FormLogin;