import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  FormControlProps,
  InputLeftAddon,
  InputGroup,
} from '@chakra-ui/react';
import { forwardRef, LegacyRef } from 'react';

type MoneyInputProps = FormControlProps & {
  name: string;
  label?: string;
  error?: string;
};

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ name, label, error, isRequired, ...rest }: MoneyInputProps, ref) => {
    return (
      <FormControl id={name} isInvalid={!!error} {...rest}>
        {label && <FormLabel>{label}</FormLabel>}

        <InputGroup width="100%">
          <InputLeftAddon>R$</InputLeftAddon>
          <NumberInput name={name} width="100%">
            <NumberInputField ref={ref as LegacyRef<HTMLInputElement>} borderLeftRadius={0} />
          </NumberInput>
        </InputGroup>
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);
