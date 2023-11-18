import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Button, IconButton, Box, Text, Tag, Flex, Stack, Center } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon, InfoIcon, WarningTwoIcon } from '@chakra-ui/icons';

import { BillTypes, BillStatus } from '@Modules/Bill/constants/Types';
import { Bill } from '@Modules/Bill/interfaces/Bill.interface';
import { billsCollection } from '@Modules/Bill/constants/FirestoreCollections';

interface BillItemProps {
  bill: Bill;
}

export const BillItem = ({ bill }: BillItemProps) => {
  const router = useRouter();
  const [loadings, setLoadings] = useState({
    changingStatus: null,
    deleting: false,
  });

  const formatValue = value => {
    return `R$${Number(value).toFixed(2).replace('.', ',')}`;
  };

  const formatDate = value => {
    const date = new Date(value).toLocaleString('pt-BR').substr(0, 10);
    return `${date}`;
  };

  const billValue = useMemo(() => {
    const typesScheme = {
      [BillTypes.EXPENSE]: 'red',
      [BillTypes.INCOME]: 'green',
    };

    const icon = {
      [BillTypes.EXPENSE]: <ArrowDownIcon color="red" />,
      [BillTypes.INCOME]: <ArrowUpIcon color="green" />,
    };

    return (
      <Tag colorScheme={typesScheme[bill.type]} color={typesScheme[bill.type]}>
        {icon[bill.type] ?? <></>} {formatValue(bill.value)}
      </Tag>
    );
  }, [bill]);

  const changeBillStatus = async status => {
    setLoadings({
      ...loadings,
      changingStatus: status,
    });

    await billsCollection.doc(bill.id).update({
      status,
    });

    setLoadings({
      ...loadings,
      changingStatus: null,
    });
  };

  const deleteBill = async () => {
    setLoadings({
      ...loadings,
      deleting: true,
    });

    await billsCollection.doc(bill.id).delete();

    setLoadings({
      ...loadings,
      changingStatus: false,
    });
  };

  const isExpiring = useMemo(() => {
    const currentDate = new Date();

    currentDate.setDate(currentDate.getDate() + 5);

    return (
      currentDate.getTime() - bill.dueDate >= 0 && bill.status !== BillStatus.PAID && bill.type === BillTypes.EXPENSE
    );
  }, [bill.dueDate, bill.status, bill.type]);

  const isPassDueDate = useMemo(() => {
    return new Date(bill.dueDate) < new Date() && bill.status !== BillStatus.PAID && bill.type === BillTypes.EXPENSE;
  }, [bill.dueDate, bill.status, bill.type]);

  const billSituation = useMemo(() => {
    console.log('isPassDueDate', isPassDueDate);
    if (isPassDueDate) {
      return (
        <Box bg="red.600" w="130px" pb={2} pt={2} mb={5} borderRadius={3}>
          <Center>
            <WarningTwoIcon color="white" />
            <Text color="white" fontSize="x-small" ml={1} fontWeight="bold">
              Conta vencida
            </Text>
          </Center>
        </Box>
      );
    }

    if (isExpiring) {
      return (
        <Box bg="yellow.600" w="130px" pb={2} pt={2} mb={5} borderRadius={3}>
          <Center>
            <InfoIcon color="white" />
            <Text color="white" fontSize="x-small" ml={1} fontWeight="bold">
              Prestes a expirar
            </Text>
          </Center>
        </Box>
      );
    }
  }, [isExpiring, isPassDueDate]);

  const itemBorderColor = useMemo(() => {
    if (isPassDueDate) return 'red.500';
    if (isExpiring) return 'yellow.500';

    return '';
  }, [isExpiring, isPassDueDate]);

  return (
    <Box w="100%" p={4} marginBottom="10px" borderWidth="1px" borderRadius="lg" borderColor={itemBorderColor}>
      {billSituation}

      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing="1">
          <Flex direction="column" alignItems="flex-start">
            <Text fontSize="md" as="b">
              {bill.name}
            </Text>
            <Text fontSize="xx-small" color="gray.600">
              Vencimento {formatDate(bill.dueDate)}
            </Text>
          </Flex>

          {bill.description && (
            <Text fontSize="small" color="gray.300">
              {bill.description}
            </Text>
          )}

          <div>{billValue}</div>
        </Stack>

        <Flex alignItems="center">
          <Flex direction="column" marginRight="10px">
            <Button
              size="xs"
              variant={bill.status === BillStatus.PENDING ? 'solid' : 'outline'}
              onClick={() => changeBillStatus(BillStatus.PENDING)}
              isLoading={loadings?.changingStatus === BillStatus.PENDING}
              colorScheme="yellow"
            >
              Pendente
            </Button>

            <Button
              size="xs"
              variant={bill.status === BillStatus.PAID ? 'solid' : 'outline'}
              onClick={() => changeBillStatus(BillStatus.PAID)}
              isLoading={loadings?.changingStatus === BillStatus.PAID}
              colorScheme="green"
              marginTop="5px"
            >
              Pago
            </Button>

            <Button
              size="xs"
              variant={bill.status === BillStatus.NOT_PAID ? 'solid' : 'outline'}
              onClick={() => changeBillStatus(BillStatus.NOT_PAID)}
              isLoading={loadings?.changingStatus === BillStatus.NOT_PAID}
              colorScheme="red"
              marginTop="5px"
            >
              Nõa pago
            </Button>
          </Flex>

          <IconButton
            aria-label="Editar conta"
            icon={<EditIcon />}
            onClick={() => router.push(`/bill/${bill.id}`)}
            variant="outline"
            size="sm"
          />

          <IconButton
            aria-label="Deletar conta"
            colorScheme="red"
            color="red.500"
            onClick={() => deleteBill()}
            icon={<DeleteIcon />}
            variant="outline"
            marginLeft="10px"
            size="sm"
          />
        </Flex>
      </Flex>
    </Box>
  );
};
