import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@chakra-ui/button';
import { useToast, Flex } from '@chakra-ui/react';

import { billsCollection } from '@Modules/Bill/constants/FirestoreCollections';
import { Bill } from '@Modules/Bill/interfaces/Bill.interface';
import { BillTypes, BillStatus } from '@Modules/Bill/constants/Types';
import { Input, MoneyInput, Select, DatePicker, Box } from '@Components';
import { useUser } from '@Modules/Authentication/context/UserContext';

interface FormBillProps {
  billId?: string;
}

const FormBill = ({ billId }: FormBillProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const router = useRouter();
  const toast = useToast();
  const { userId } = useUser();

  const [foundBill, setFoundBill] = useState<Bill | undefined>();

  const onSubmit = async values => {
    if (!userId) return;

    const dueDate = new Date(values.dueDate);
    dueDate.setHours(3, 0, 0, 0);

    console.log(values);
    const bill: Bill = {
      name: values.name,
      description: values.description ?? '',
      value: Number(values.value),
      dueDate: dueDate.getTime(),
      status: billId ? foundBill?.status : BillStatus.PENDING,
      type: values.type,
      createdAt: new Date().getTime(),
      userId,
    };

    try {
      if (billId) {
        await billsCollection.doc(billId).update(bill);
      } else {
        await billsCollection.add(bill);
      }
      toast({
        description: 'Bill successful submited!',
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
        toast({
          description: 'Bill not found!',
          status: 'error',
        });
      }
    };

    findBill();
  }, [billId, toast]);

  useEffect(() => {
    console.log(foundBill);
    setValue('name', foundBill?.name);
    setValue('description', foundBill?.description);
    setValue('dueDate', foundBill?.dueDate);
    setValue('type', foundBill?.type);
    setValue('value', String(foundBill?.value));
  }, [foundBill, setValue]);

  const years = useMemo(() => {
    const finalYears = [];
    const beginYear = 2020;

    for (let yearCount = 0; yearCount < 5; yearCount++) {
      finalYears.push({
        value: beginYear + yearCount,
        label: `${beginYear + yearCount}`,
      });
    }

    return finalYears;
  }, []);

  const types = [
    {
      label: 'Expense',
      value: BillTypes.EXPENSE,
    },
    {
      label: 'Income',
      value: BillTypes.INCOME,
    },
  ];

  return (
    <Box title="Create new bill" margin="10px" padding="10px" borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" alignItems="flex-start">
          <Input
            name="name"
            label="Billing name"
            {...register('name', { required: true })}
            error={errors.name?.message}
            marginBottom="10px"
          />

          <Input
            name="description"
            label="Billing description"
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
                label="Bill Due Date"
                onChange={date => field.onChange(date)}
                selected={field.value}
                style={{ marginBottom: '10px' }}
              />
            )}
          />

          <Select
            name="type"
            label="Type"
            options={types}
            {...register('type')}
            error={errors.type?.message}
            marginBottom="10px"
          />

          <MoneyInput
            name="value"
            label="Billing value"
            {...register('value')}
            error={errors.value?.message}
            marginBottom="10px"
          />

          <Button type="submit" isLoading={isSubmitting}>
            Submit
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default FormBill;
