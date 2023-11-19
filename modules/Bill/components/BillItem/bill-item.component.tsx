import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  IconButton,
  Box,
  Text,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Stack,
  Tag,
  Flex,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon, InfoIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdOutlineMoneyOffCsred, MdOutlineAttachMoney, MdCopyAll } from 'react-icons/md';
import { IoMdCalendar } from 'react-icons/io';
import { FaAngleDown } from 'react-icons/fa6';

import { BillTypes, BillStatus } from '@Modules/Bill/constants/Types';
import { Bill } from '@Modules/Bill/interfaces/Bill.interface';
import { billsCollection, billsRecurrenceCollection } from '@Modules/Bill/constants/FirestoreCollections';
import { If } from '@Components';

const textsBillStatus = {
  [BillStatus.NOT_PAID]: 'Não pago',
  [BillStatus.PAID]: 'Pago',
  [BillStatus.PENDING]: 'Pendente',
};

interface BillItemProps {
  bill: Bill;
  onCopyBill: (billId: string) => void;
  onDeleteBill: (billId: string) => void;
}

export const BillItem = ({ bill, onCopyBill, onDeleteBill }: BillItemProps) => {
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
    const hasRecurrence = await (await billsRecurrenceCollection.where('bills', 'array-contains', bill.id)).get();

    console.log(bill.id, hasRecurrence);
    //    setLoadings({
    //      ...loadings,
    //      deleting: true,
    //    });
    //
    //    await billsCollection.doc(bill.id).delete();
    //
    //    setLoadings({
    //      ...loadings,
    //      changingStatus: false,
    //    });
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

  const billStatusColor = useMemo(() => {
    let color = 'yellow';

    if (bill.status === BillStatus.NOT_PAID) {
      color = 'red';
    }

    if (bill.status === BillStatus.PAID) {
      color = 'green';
    }

    return color;
  }, [bill.status]);

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
          <Popover placement="bottom-end" isLazy>
            <PopoverTrigger>
              <Button
                aria-label="Selecionar status da conta"
                rightIcon={<FaAngleDown />}
                variant="outline"
                size="sm"
                w="fit-content"
                mr={5}
                colorScheme={billStatusColor}
              >
                {textsBillStatus[bill.status]}
              </Button>
            </PopoverTrigger>
            <PopoverContent w="fit-content" _focus={{ boxShadow: 'none' }}>
              <PopoverArrow />
              <PopoverBody>
                <Stack>
                  <Button
                    w="175px"
                    variant="ghost"
                    leftIcon={<MdOutlineMoneyOffCsred />}
                    justifyContent="flex-start"
                    fontWeight="normal"
                    fontSize="sm"
                    onClick={() => changeBillStatus(BillStatus.NOT_PAID)}
                    isLoading={loadings?.changingStatus === BillStatus.NOT_PAID}
                    colorScheme="red"
                  >
                    Não pago
                  </Button>

                  <Button
                    w="175px"
                    variant="ghost"
                    leftIcon={<MdOutlineAttachMoney />}
                    justifyContent="flex-start"
                    fontWeight="normal"
                    fontSize="sm"
                    onClick={() => changeBillStatus(BillStatus.PAID)}
                    isLoading={loadings?.changingStatus === BillStatus.PAID}
                    colorScheme="green"
                  >
                    Pago
                  </Button>

                  <Button
                    w="175px"
                    variant="ghost"
                    leftIcon={<IoMdCalendar />}
                    justifyContent="flex-start"
                    fontWeight="normal"
                    fontSize="sm"
                    onClick={() => changeBillStatus(BillStatus.PENDING)}
                    isLoading={loadings?.changingStatus === BillStatus.PENDING}
                    colorScheme="yellow"
                  >
                    Pendente
                  </Button>
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Popover placement="bottom-end" isLazy>
            <PopoverTrigger>
              <IconButton
                aria-label="More server options"
                icon={<BsThreeDotsVertical />}
                variant="outline"
                size="sm"
                w="fit-content"
              />
            </PopoverTrigger>
            <PopoverContent w="fit-content" _focus={{ boxShadow: 'none' }}>
              <PopoverArrow />
              <PopoverBody>
                <Stack>
                  <Button
                    w="210px"
                    variant="ghost"
                    leftIcon={<EditIcon />}
                    justifyContent="flex-start"
                    fontWeight="normal"
                    fontSize="sm"
                    onClick={() => router.replace(`/bill/${bill.id}`)}
                  >
                    Editar conta
                  </Button>
                  <Button
                    w="210px"
                    variant="ghost"
                    leftIcon={<MdCopyAll />}
                    justifyContent="flex-start"
                    fontWeight="normal"
                    fontSize="sm"
                    onClick={() => onCopyBill(bill.id)}
                  >
                    Copiar conta
                  </Button>

                  <Button
                    w="210px"
                    variant="ghost"
                    leftIcon={<DeleteIcon />}
                    justifyContent="flex-start"
                    fontWeight="normal"
                    colorScheme="red"
                    fontSize="sm"
                    onClick={() => onDeleteBill(bill.id)}
                  >
                    Deletar conta
                  </Button>
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      </Flex>
    </Box>
  );
};
