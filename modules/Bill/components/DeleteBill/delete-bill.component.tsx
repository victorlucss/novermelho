import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@chakra-ui/button';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';

import { Modal } from '@Components/Modal';
import { billsCollection, billsRecurrenceCollection } from '@Modules/Bill/constants/FirestoreCollections';
import { Bill } from '@Modules/Bill/interfaces/Bill.interface';
import { BillStatus } from '@Modules/Bill/constants/Types';

export const DeleteBill = ({ isOpen, onClose, billId }) => {
  const toast = useToast();
  const [isRecurrence, setIsRecurrence] = useState(false);

  const checkRecurrence = useCallback(async () => {
    if (!billId) return;

    const hasRecurrence = await (await billsRecurrenceCollection.where('bills', 'array-contains', billId)).get();

    setIsRecurrence(!hasRecurrence.empty);
  }, [billId]);

  useEffect(() => {
    checkRecurrence();
  }, [checkRecurrence]);
  const deleteBill = async (deleteRecurrence = false) => {
    try {
      if (deleteRecurrence) {
        const recurrenceDoc = (
          await (await billsRecurrenceCollection.where('bills', 'array-contains', billId).limit(1)).get()
        )?.docs[0];

        let execution = [billsRecurrenceCollection.doc(recurrenceDoc.id).delete()];

        recurrenceDoc.data().bills.forEach(id => billsCollection.doc(id).delete());

        await Promise.all(execution);

        return toast({
          description: 'Conta e recorrências deletadas com sucesso!',
          status: 'success',
        });
      }

      await billsCollection.doc(billId).delete();
      toast({
        description: 'Conta deletada com sucesso!',
        status: 'success',
      });
    } catch (error) {
      console.error(error);
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <>
        <ModalOverlay />
        <ModalContent maxW="95vw" margin="auto">
          <ModalHeader>Deletar conta</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isRecurrence
              ? 'Você deseja deletar somente esta conta ou toda recorrência?'
              : 'Deseja realmente deletar esta conta?'}
          </ModalBody>

          <ModalFooter>
            {isRecurrence ? (
              <>
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button colorScheme="red" ml={3} onClick={() => deleteBill()}>
                  Deletar conta
                </Button>
                <Button colorScheme="red" ml={3} onClick={() => deleteBill(true)}>
                  Deletar recorrência
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button colorScheme="red" ml={3} onClick={() => deleteBill()}>
                  Deletar conta
                </Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </>
    </Modal>
  );
};
