import React, { HTMLAttributes } from 'react';
import ReactDatePicker from 'react-datepicker';
import { FormControl, FormLabel, FormErrorMessage, useColorMode } from '@chakra-ui/react';

import { useIsMobile } from '@Modules/BaseModule/hooks/useIsMobile';

interface Props {
  isClearable?: boolean;
  onChange: (date: Date) => any;
  selected: Date | undefined;
  showPopperArrow?: boolean;
  name: string;
  label?: string;
  error?: string;
  value?: string;
  maxDate?: Date;
  minDate?: Date;
}

export const DatePicker = ({
  selected,
  onChange,
  isClearable = false,
  showPopperArrow = false,
  name,
  label,
  error,
  value,
  maxDate,
  minDate,
  ...rest
}: Props & HTMLAttributes<HTMLElement>) => {
  const isLight = useColorMode().colorMode === 'light';
  const isMobile = useIsMobile();

  return (
    <FormControl id={name} isInvalid={!!error} {...rest}>
      {label && <FormLabel>{label}</FormLabel>}
      <div className={`${isLight ? 'light-theme' : 'dark-theme'}`}>
        <ReactDatePicker
          dateFormat="dd/MM/yyyy"
          selected={selected}
          onChange={onChange}
          isClearable={isClearable}
          showPopperArrow={showPopperArrow}
          maxDate={maxDate}
          minDate={minDate}
          className={!!error ? 'hasError' : ''}
          withPortal={isMobile}
        />
      </div>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
