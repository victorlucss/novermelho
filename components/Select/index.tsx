import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input as ChakraInput,
  FormControlProps,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps
} from '@chakra-ui/react'
import { forwardRef, LegacyRef } from 'react'

interface Option {
  value: string | ReadonlyArray<string> | number | undefined
  label: string
}

type SelectProps = ChakraSelectProps & FormControlProps & {
  name: string,
  label?: string,
  error?: string,
  value?: string | number | undefined,
  options: Option[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  name,
  label,
  error,
  value,
  options,
  ...rest
}: SelectProps, ref) => {
  return (
    <FormControl id={name} isInvalid={!!error} {...rest}>
      {label && <FormLabel>{label}</FormLabel>}
      <ChakraSelect
        name={name}
        defaultValue={value}
        ref={ref as LegacyRef<HTMLSelectElement>}>
          {options.map(({ value: optionValue, label }) => <option key={label} value={optionValue}>{label}</option>)}
      </ChakraSelect>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
})