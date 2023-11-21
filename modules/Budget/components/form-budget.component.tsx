import React, { useCallback, useEffect, useState } from 'react';
import { object, string } from 'yup';
import { useToast, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import BaseForm from '@Modules/BaseModule/container/BaseForm';
import { BUBBLE_TYPES, BubbleEnum } from '@Modules/BaseModule/constants/Bubble';
import { BillTypes } from '@Modules/Bill/constants/Types';
import { useUser } from '@Authentication/context/UserContext';
import { useCategories } from '@Modules/Category/hooks/useCategories';
import {
  createBudget,
  getOneBudget,
  updateBudget,
  verifyExistsBudgetCategory,
  IBudget,
} from '@Modules/Budget/services/budget.service';

interface FormBudgetProps {
  id?: string;
}

const schema = object().shape({
  name: string().required('Este campo é obrigatório.'),
  value: string().required('Este campo é obrigatório.'),
  categoryId: string().required('Este campo é obrigatório.'),
});

export const FormBudget = ({ id }: FormBudgetProps) => {
  const toast = useToast();
  const router = useRouter();
  const { userId } = useUser();
  const categories = useCategories({ type: BillTypes.EXPENSE });
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (categories?.length > 0) {
      setFields([
        {
          name: 'name',
          label: 'Nome',
          type: BUBBLE_TYPES.INPUT_TEXT as BubbleEnum,
        },
        {
          name: 'value',
          label: 'Valor',
          type: BUBBLE_TYPES.MONEY as BubbleEnum,
        },
        {
          name: 'categoryId',
          label: 'Categoria',
          type: BUBBLE_TYPES.SELECT as BubbleEnum,
          options: categories.map(({ id, name }) => ({ label: name, value: id })),
        },
      ]);
    }
  }, [categories]);

  const fetch = useCallback(
    async id => {
      return getOneBudget(id);
    },
    [id]
  );

  const onSubmit = async (values: IBudget) => {
    try {
      if (id) {
        return updateBudget(id, {
          userId,
          ...values,
        });
      } else {
        const verifyAlreadyExistsCategory = await verifyExistsBudgetCategory(userId, values.categoryId);
        if (verifyAlreadyExistsCategory) {
          return toast({
            description: 'Já existe um orçamento criado para esta categoria!',
            status: 'error',
          });
        }

        await createBudget({
          userId,
          ...values,
        });
      }
      toast({
        description: `Orçamento ${id ? 'editado' : 'criado'} com sucesso!`,
        status: 'success',
      });
      router.replace('/budget');
    } catch (error) {
      toast({
        description: error.message,
        status: 'error',
      });
    }
  };

  return (
    <>
      <Text fontSize="lg" fontWeight="bold" color="white" mb={3}>
        {id ? 'Editar' : 'Criar'} orçamento
      </Text>

      <BaseForm<IBudget>
        id={id}
        fields={fields}
        fetch={fetch}
        onSubmit={onSubmit}
        submitLabel={id ? 'Editar' : 'Criar'}
        schema={schema}
      />
    </>
  );
};
