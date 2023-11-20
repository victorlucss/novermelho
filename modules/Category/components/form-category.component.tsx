import React, { useCallback } from 'react';
import { object, string } from 'yup';
import { useToast, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import BaseForm from '@Modules/BaseModule/container/BaseForm';
import { BUBBLE_TYPES, BubbleEnum } from '@Modules/BaseModule/constants/Bubble';
import { firestore } from '@Configs/Firebase';
import { BillTypes } from '@Modules/Bill/constants/Types';
import { useUser } from '@Authentication/context/UserContext';

interface FormCategoryProps {
  id?: string | number;
}
interface ICategory {
  id?: string;
  name: string;
  color: string;
}

const fields = [
  {
    name: 'name',
    label: 'Nome',
    type: BUBBLE_TYPES.INPUT_TEXT as BubbleEnum,
  },
  {
    name: 'color',
    label: 'Cor',
    type: BUBBLE_TYPES.INPUT_COLOR as BubbleEnum,
  },
  {
    name: 'type',
    label: 'Tipo',
    type: BUBBLE_TYPES.SELECT as BubbleEnum,
    options: [
      {
        label: 'Despesa',
        value: BillTypes.EXPENSE,
      },
      {
        label: 'Receita',
        value: BillTypes.INCOME,
      },
    ],
  },
];

const schema = object().shape({
  name: string().required('Este campo é obrigatório.'),
  color: string().required('Este campo é obrigatório.'),
  type: string().required('Este campo é obrigatório.'),
});

export const FormCategory = ({ id }: FormCategoryProps) => {
  const toast = useToast();
  const router = useRouter();
  const { userId } = useUser();

  const fetch = useCallback(async () => {
    const categoryDoc = await firestore
      .collection('categories')
      .doc(id as string)
      .get();

    return categoryDoc.data() as ICategory;
  }, [id]);

  const onSubmit = async values => {
    try {
      if (id) {
        firestore
          .collection('categories')
          .doc(id as string)
          .update({
            userId,
            ...values,
          });
      } else {
        firestore.collection('categories').add({
          userId,
          ...values,
        });
      }
      toast({
        description: `Categoria ${id ? 'editada' : 'criada'} com sucesso!`,
        status: 'success',
      });
      router.replace('/category');
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
        {id ? 'Editar' : 'Criar'} categoria
      </Text>
      <BaseForm<ICategory>
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
