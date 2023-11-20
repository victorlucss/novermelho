import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import BaseField from '@Modules/BaseModule/interfaces/BaseField';
import renderFields from '@Modules/BaseModule/shared/renderFields';

interface BaseFormInterface<T> {
  id?: string | number;
  fetch?: (id: string | number) => Promise<T>;
  fields: BaseField[];
  onSubmit: (element: T) => T | Promise<T> | Promise<void>;
  submitLabel?: string;
  schema: Yup.AnyObjectSchema;
}

const BaseForm = <T extends {}>({
  id,
  fetch,
  onSubmit,
  fields,
  submitLabel = 'Submit',
  schema,
}: BaseFormInterface<T>) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const wrapperOnSubmit = values => {
    const element = values as T;

    onSubmit(element);
  };

  const fetchData = useCallback(
    async (id): Promise<T> => {
      if (id && !!fetch) {
        const model = await fetch(id);

        if (model) {
          fields.forEach(({ name }) => {
            if (model[name]) {
              setValue(name, model[name]);
            }
          });
        }

        return model;
      }
    },
    [fetch, fields, setValue]
  );
  //
  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [fetchData, id]);

  return (
    <form onSubmit={handleSubmit(wrapperOnSubmit)}>
      <Flex direction="column" alignItems="flex-start">
        {renderFields(fields, errors, register)}

        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </Flex>
    </form>
  );
};

export { BaseForm };
export default BaseForm;
