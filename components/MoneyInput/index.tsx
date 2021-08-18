import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInputProps,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControlProps
} from '@chakra-ui/react'
import { forwardRef, LegacyRef } from 'react'

type MoneyInputProps = FormControlProps & {
  name: string,
  label?: string,
  error?: string
}

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(({
  name,
  label,
  error,
  ...rest
}: MoneyInputProps, ref) => {
  return (
    <FormControl id={name} isInvalid={!!error} {...rest}>
      {label && <FormLabel>{label}</FormLabel>}

      <NumberInput
        name={name}
        ref={ref as LegacyRef<HTMLInputElement>}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
})