import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@chakra-ui/button';
import { useToast, Flex, useRadioGroup, HStack, Text } from '@chakra-ui/react';

import { billsCollection } from '@Modules/Bill/constants/FirestoreCollections';
import { Bill } from '@Modules/Bill/interfaces/Bill.interface';
import { BillTypes, BillStatus } from '@Modules/Bill/constants/Types';
import { Input, MoneyInput, Select, DatePicker, Box, RadioCard, If } from '@Components';
import { useUser } from '@Modules/Authentication/context/UserContext';

interface FormBillProps {
  billId?: string;
}

export const FormBillContainer = ({ billId }: FormBillProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const router = useRouter();
  const toast = useToast();
  const { userId } = useUser();

  const [foundBill, setFoundBill] = useState<Bill | undefined>();

  const categoriesExpense = ['💳 Cartão de crédito', '💰 Investimento', '💸 Fixo', '🔁 Flexível', '💲 Outro'];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'category',
    defaultValue: categoriesExpense[0],
    onChange: category => setValue('category', category),
  });

  const group = getRootProps();
  const onSubmit = async values => {
    if (!userId) return;

    const dueDate = new Date(values.dueDate);
    dueDate.setHours(3, 0, 0, 0);

    const bill: Bill = {
      name: values.name,
      description: values.description ?? '',
      value: Number(values.value),
      dueDate: dueDate.getTime(),
      status: billId ? foundBill?.status : BillStatus.PENDING,
      type: values.type,
      createdAt: new Date().getTime(),
      userId,
      category: values.type === BillTypes.EXPENSE ? values.category : '',
    };

    try {
      if (billId) {
        await billsCollection.doc(billId).update(bill);
      } else {
        await billsCollection.add(bill);
      }
      toast({
        description: 'Conta criada com sucesso!',
        status: 'success',
      });

      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const findBill = async () => {
      if (!billId) return;

      const billDoc = await billsCollection.doc(billId).get();
      if (billDoc.exists) {
        setFoundBill({ id: billDoc.id, ...billDoc.data() } as Bill);
      } else {
        router.push('/');
        toast({
          description: 'Conta não encontrada!',
          status: 'error',
        });
      }
    };

    findBill();
  }, [billId, router, toast]);

  useEffect(() => {
    setValue('name', foundBill?.name);
    setValue('description', foundBill?.description);
    setValue('dueDate', foundBill?.dueDate);
    setValue('type', foundBill?.type);
    setValue('value', String(foundBill?.value));
    setValue('type', foundBill?.type);
    setValue('category', foundBill?.category);
  }, [foundBill, setValue]);

  const types = [
    {
      label: 'Despesa',
      value: BillTypes.EXPENSE,
    },
    {
      label: 'Receita',
      value: BillTypes.INCOME,
    },
  ];
  const billType = watch('type', false);
  return (
    <Box
      title="Criar nova conta"
      description={billId ? '' : 'Adicione uma nova despesa agora e mantenha o controle total do seu orçamento!'}
      margin="10px"
      padding="10px"
      borderWidth="1px"
      borderRadius="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" alignItems="flex-start">
          <Input
            name="name"
            label="Título"
            {...register('name', { required: true })}
            error={errors.name?.message}
            marginBottom="10px"
          />

          <Input
            name="description"
            label="Descrição"
            {...register('description')}
            error={errors.description?.message}
            marginBottom="10px"
          />

          <Controller
            control={control}
            name="dueDate"
            render={({ field }) => (
              <DatePicker
                name="dueDate"
                label="Data de vencimento"
                onChange={date => field.onChange(date)}
                selected={field.value}
                defaultValue={new Date().getTime()}
                style={{ marginBottom: '10px' }}
              />
            )}
          />

          <Select
            name="type"
            label="Tipo"
            options={types}
            {...register('type')}
            error={errors.type?.message}
            marginBottom="10px"
          />

          <MoneyInput
            name="value"
            label="Valor"
            {...register('value')}
            error={errors.value?.message}
            marginBottom="10px"
          />

          <If condition={billType === BillTypes.EXPENSE}>
            <Text fontWeight="500" fontSize="1rem" mb="0.75rem">
              Categoria
            </Text>
            <HStack {...group} mb="10px">
              {categoriesExpense.map(value => {
                const radio = getRadioProps({ value });
                return (
                  <RadioCard key={value} {...radio}>
                    {value}
                  </RadioCard>
                );
              })}
            </HStack>
          </If>

          <Button type="submit" isLoading={isSubmitting}>
            {billId ? 'Editar' : 'Criar'}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
