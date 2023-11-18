import React, { useMemo, useEffect } from 'react';
import { Button } from '@chakra-ui/button';
import { useForm } from 'react-hook-form';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Spacer,
  Box,
  useToast,
} from '@chakra-ui/react';

import { Select } from '@Components/Select';
import { MONTHS_DICT, TO_YEAR, FROM_YEAR } from '@Modules/Bill/constants/BillConsts';
import { Modal } from '@Components/Modal';
import { billsCollection } from '@Modules/Bill/constants/FirestoreCollections';
import { Bill } from '@Modules/Bill/interfaces/Bill.interface';
import { BillStatus } from '@Modules/Bill/constants/Types';

export const CopyBill = ({ isOpen, onClose, billId }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm();

  const toast = useToast();

  useEffect(() => {
    setValue('month', new Date().getMonth());
    setValue('year', new Date().getFullYear());
  }, [setValue]);

  const years = useMemo(() => {
    const finalYears = [];

    if (FROM_YEAR > TO_YEAR) {
      throw new Error('From must be lower than to');
    }

    if (TO_YEAR - FROM_YEAR <= 0) {
      throw new Error('To minus from must be over 0');
    }

    for (let yearCount = 0; yearCount <= TO_YEAR - FROM_YEAR; yearCount++) {
      finalYears.push({
        label: `${FROM_YEAR + yearCount}`,
        to: FROM_YEAR + yearCount,
      });
    }

    return finalYears;
  }, []);

  const months = useMemo(() => {
    const finalMonths = [];

    for (let monthCount = 0; monthCount <= 11; monthCount++) {
      finalMonths.push({
        label: `${MONTHS_DICT[monthCount]}`,
        value: monthCount,
      });
    }

    return finalMonths;
  }, []);

  const month = watch('month', false);
  const year = watch('year', false);

  const onSubmit = async values => {
    const billDoc = await billsCollection.doc(billId).get();
    if (billDoc.exists) {
      const billData = billDoc.data() as Bill;

      const day = new Date(billData.dueDate).getDay();
      const newDueDate = new Date(values.year, values.month, day);

      try {
        await billsCollection.add({
          ...billData,
          status: BillStatus.PENDING,
          dueDate: newDueDate.getTime(),
          createdAt: new Date().getTime(),
        });

        onClose();

        toast({
          description: 'Conta copiada com sucesso!',
          status: 'success',
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <>
        <ModalOverlay />
        <ModalContent maxW="95vw" margin="auto">
          <ModalHeader>Copiar conta</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column">
              <Select
                name="year"
                label="Ano"
                options={years}
                {...register('year')}
                onChange={select => setValue('year', +select.target.value)}
                error={errors.year?.message}
                mb={2}
              />

              <Select
                name="month"
                label="Mês"
                options={months}
                {...register('month')}
                onChange={select => setValue('month', +select.target.value)}
                error={errors.month?.message}
              />
            </Flex>
            Você tem certeza que deseja copiar essa conta para o mês de {month}/{year}?
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost">Cancelar</Button>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
              Copiar conta
            </Button>
          </ModalFooter>
        </ModalContent>
      </>
    </Modal>
  );
};
