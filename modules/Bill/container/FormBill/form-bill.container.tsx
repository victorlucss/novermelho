import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@chakra-ui/button';
import { useToast, Flex, Text, Switch } from '@chakra-ui/react';

import { billsCollection, billsRecurrenceCollection } from '@Modules/Bill/constants/FirestoreCollections';
import { Bill } from '@Modules/Bill/interfaces/Bill.interface';
import { BillTypes, BillStatus } from '@Modules/Bill/constants/Types';
import { Input, MoneyInput, Select, DatePicker, Box, If } from '@Components';
import { useUser } from '@Modules/Authentication/context/UserContext';
import { defaultRequiredMessage, TO_YEAR } from '@Modules/Bill/constants/BillConsts';

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

const recurrenceTypes = [
  {
    label: 'Cada mês',
    value: 'EVERY_MONTH',
  },
  {
    label: 'Cada ano',
    value: 'EVERY_YEAR',
  },
];

const categoriesExpense = [
  {
    label: '💳 Cartão de crédito',
    value: 'CREDIT_CARD',
  },
  {
    label: '💰 Investimento',
    value: 'INVESTING',
  },
  {
    label: '💸 Fixo',
    value: 'FIXED',
  },
  {
    label: '🔁 Flexível',
    value: 'FLEX',
  },
  {
    label: '💲 Outro',
    value: 'OTHER',
  },
];

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

  useEffect(() => {
    try {
      const queryBillType = router.query?.type as keyof typeof BillTypes;
      setValue('type', queryBillType);
    } catch (error) {
      console.error(error);
    }
  }, [router.query.type, setValue]);

  useEffect(() => {
    setValue('category', categoriesExpense[0].value);
  }, [setValue]);

  const onSubmit = async values => {
    if (!userId) return;

    const dueDate = new Date(values.dueDate);
    dueDate.setHours(3, 0, 0, 0);

    const bill: Bill = {
      name: values.name,
      description: values.description ?? '',
      value: +values.value,
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
        console.log(values);
        if (values.recurrence) {
          let endOcurrence = new Date(values.recurrenceDueDate);
          let indexOcurrence = new Date();
          indexOcurrence.setDate(endOcurrence.getDate());

          let billsToAdd = [billsCollection.add(bill)];
          const billDateDay = new Date(bill.dueDate).getDate();
          while (endOcurrence >= indexOcurrence) {
            indexOcurrence.setMonth(indexOcurrence.getMonth() + 1);

            billsToAdd.push(
              billsCollection.add({
                ...bill,
                dueDate: new Date(indexOcurrence.getFullYear(), indexOcurrence.getMonth(), billDateDay).getTime(),
              })
            );
          }

          const addedBills = await Promise.all(billsToAdd);

          await billsRecurrenceCollection.add({
            type: values.recurrenceType,
            ends_in: values.recurrenceDueDate,
            bills: addedBills.map(({ id }) => `bills/${id}`),
          });

          return toast({
            description: 'Conta e recorrência criados com sucesso!',
            status: 'success',
          });
        }

        await billsCollection.add(bill);
      }
      toast({
        description: 'Conta criada com sucesso!',
        status: 'success',
      });

      router.push('/');
    } catch (error) {
      console.error(error);
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

  const billType = watch('type', false);
  const billRecurrence = watch('recurrence', false);

  const title = useMemo(() => {
    const prefix = billId ? 'Editar' : 'Criar nova';
    if (router.query.type) {
      const foundType = types.find(type => type.value === router.query.type);

      if (!foundType) return `${prefix} conta`;

      return `${prefix} ${foundType.label.toLocaleLowerCase()}`;
    }

    return `${prefix} conta`;
  }, [billId, router.query.type]);

  console.log(errors);

  return (
    <Box
      title={title}
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
            {...register('name', { ...defaultRequiredMessage })}
            error={errors.name?.message}
            mb={5}
          />

          <Input
            name="description"
            label="Descrição"
            {...register('description')}
            error={errors.description?.message}
            mb={5}
          />

          <Controller
            control={control}
            name="dueDate"
            rules={{ ...defaultRequiredMessage }}
            render={({ field }) => (
              <DatePicker
                name="dueDate"
                label="Data de vencimento"
                onChange={date => field.onChange(date)}
                selected={field.value}
                defaultValue={new Date().getTime()}
                style={{ marginBottom: '10px' }}
                error={errors.dueDate?.message}
              />
            )}
          />

          <If condition={!router.query?.type}>
            <Select
              name="type"
              label="Tipo"
              options={categoriesExpense}
              {...register('type', { ...defaultRequiredMessage })}
              error={errors.type?.message}
              mb={5}
            />
          </If>

          <MoneyInput
            name="value"
            label="Valor"
            {...register('value', { ...defaultRequiredMessage })}
            error={errors.value?.message}
            mb={5}
            isRequired
          />

          <Select
            name="type"
            label="Categoria"
            options={categoriesExpense}
            {...register('category', { ...defaultRequiredMessage })}
            error={errors.category?.message}
            mb={5}
          />

          <Flex>
            <Text fontWeight="500" fontSize="1rem" mr="0.75rem">
              Recorrência
            </Text>

            <Switch name="recurrence" {...register('recurrence')} />
          </Flex>
          <Text fontSize="0.5rem" mb={5}>
            Contas reccorentes serão criadas com a frequência que você determinar.
          </Text>

          <If condition={!!billRecurrence}>
            <Box bg="gray.700" p={4} borderRadius={5} width="100%" mb={5}>
              <Select
                name="recurrenceType"
                label="Frequência"
                options={recurrenceTypes}
                {...register('recurrenceType')}
                defaultValue="EVERY_MONTH"
                error={errors.recurrence_type?.message}
                mb={5}
              />

              <Controller
                control={control}
                name="recurrenceDueDate"
                render={({ field }) => (
                  <DatePicker
                    name="recurrenceDueDate"
                    label="Acaba em"
                    onChange={date => field.onChange(date)}
                    selected={field.value}
                    defaultValue={new Date().getTime()}
                    minDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)}
                    maxDate={new Date(TO_YEAR, 11, 31)}
                  />
                )}
              />
            </Box>
          </If>

          <Button type="submit" isLoading={isSubmitting}>
            {billId ? 'Editar' : 'Criar'}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
