import React from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

import { Input, Select, MoneyInput } from '@Components';
import SelectOption from '@Modules/BaseModule/interfaces/SelectOption';

import { BubbleEnum, BUBBLE_TYPES } from '../../constants/Bubble';

interface BubbleInterface {
  type: BubbleEnum;
  name: string;
  label: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  required?: boolean;
  props?: object;
  options?: SelectOption[];
  value?: (string | number | readonly string[]) & string;
}

const Bubble = ({
  type,
  name,
  label,
  register,
  errors,
  required = false,
  options = [],
  value,
  props = {},
}: BubbleInterface) => {
  switch (type) {
    case BUBBLE_TYPES.INPUT_TEXT:
      return (
        <Input
          name={name}
          label={label}
          {...register(name, { required })}
          error={errors[name]?.message}
          value={value}
          {...props}
        />
      );

    case BUBBLE_TYPES.INPUT_COLOR:
      return (
        <Input
          name={name}
          label={label}
          type="color"
          {...register(name, { required })}
          error={errors[name]?.message}
          value={value}

        {...props}/>
      );

      case BUBBLE_TYPES.MONEY:
        return (
          <MoneyInput
            name={name}
            label={label}
            {...register(name, { required })}
            error={errors[name]?.message}
            {...props}
          />
          );

    case BUBBLE_TYPES.SELECT:
      return (
        <Select
          name={name}
          label={label}
          options={options}
          {...register(name)}
          value={value}
          error={errors[name]?.message}
          {...props}
        />
      );

    default:
      return <></>;
  }
};

export default Bubble;
