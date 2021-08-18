import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputProps as ChakraInputProps,
  Input as ChakraInput,
  FormControlProps
} from '@chakra-ui/react'
import { forwardRef, LegacyRef } from 'react'

type InputProps = ChakraInputProps & FormControlProps & {
  name: string,
  label?: string,
  error?: string,
  value?: string,
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  name,
  type = 'text',
  label,
  error,
  ...rest
}: InputProps, ref) => {
  return (
    <FormControl id={name} isInvalid={!!error} {...rest}>
      {label && <FormLabel>{label}</FormLabel>}
      <ChakraInput
        name={name}
        type={type}
        ref={ref as LegacyRef<HTMLInputElement>} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
})