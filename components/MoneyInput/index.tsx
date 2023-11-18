import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControlProps,
} from '@chakra-ui/react';
import { forwardRef, LegacyRef } from 'react';

type MoneyInputProps = FormControlProps & {
  name: string;
  label?: string;
  error?: string;
};

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ name, label, error, ...rest }: MoneyInputProps, ref) => {
    return (
      <FormControl id={name} isInvalid={!!error} {...rest}>
        {label && <FormLabel>{label}</FormLabel>}

        <NumberInput name={name}>
          <NumberInputField ref={ref as LegacyRef<HTMLInputElement>} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  }
);
