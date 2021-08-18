import { useForm } from "react-hook-form";

import { Input }  from '@Components'
import { Button } from '@chakra-ui/button'
import { useToast, Flex, Box } from '@chakra-ui/react'
import { auth } from '@Configs/Firebase'
import { useUser } from '@Modules/Authentication/context/UserContext'
import { useRouter } from 'next/router'

const FormSignUp = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm();
  const Router = useRouter()
  const toast = useToast()
  const { setUserId } = useUser()

  const onSubmit = async (values) => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(values.email, values.password)
      
      localStorage.setItem('USER_UID', user.uid)
      setUserId(user.uid)
      Router.replace('/')
      
      toast({
        description: 'User successful created!',
        status: 'success',
      })
    } catch (error) {
      console.error(error);
    }
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
            <Button type="submit" isLoading={isSubmitting}>Register</Button>
          </div>
        </Flex>
      </form>
    </Box>
  )
}

export default FormSignUp;