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
  Badge,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon, InfoIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdOutlineMoneyOffCsred, MdOutlineAttachMoney } from 'react-icons/md';
import { IoMdCalendar } from 'react-icons/io';

import { BillTypes, BillStatus } from '@Modules/Bill/constants/Types';
import { Bill } from '@Modules/Bill/interfaces/Bill.interface';
import { billsCollection } from '@Modules/Bill/constants/FirestoreCollections';
import { If } from '@Components';

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

  const billStatus = useMemo(() => {
    const props = {
      color: 'yellow',
      text: 'Pendente',
    };

    if (bill.status === BillStatus.NOT_PAID) {
      props.color = 'red';
      props.text = 'Não pago';
    }

    if (bill.status === BillStatus.PAID) {
      props.color = 'green';
      props.text = 'Pago';
    }

    return (
      <Badge colorScheme={props.color} size="sm">
        {props.text}
      </Badge>
    );
  }, [bill.status]);

  return (
    <Box w="100%" p={4} marginBottom="10px" borderWidth="1px" borderRadius="lg" borderColor={itemBorderColor}>
      {billSituation}

      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing="1">
          <Flex direction="column" alignItems="flex-start">
            <Text fontSize="md" as="b">
              {bill.name} {billStatus}
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
                  <If condition={bill.status !== BillStatus.NOT_PAID}>
                    <Button
                      w="210px"
                      variant="ghost"
                      leftIcon={<MdOutlineMoneyOffCsred />}
                      justifyContent="flex-start"
                      fontWeight="normal"
                      fontSize="sm"
                      onClick={() => changeBillStatus(BillStatus.NOT_PAID)}
                      isLoading={loadings?.changingStatus === BillStatus.NOT_PAID}
                    >
                      Marcar como não pago
                    </Button>
                  </If>
                  <If condition={bill.status !== BillStatus.PAID}>
                    <Button
                      w="210px"
                      variant="ghost"
                      leftIcon={<MdOutlineAttachMoney />}
                      justifyContent="flex-start"
                      fontWeight="normal"
                      fontSize="sm"
                      onClick={() => changeBillStatus(BillStatus.PAID)}
                      isLoading={loadings?.changingStatus === BillStatus.PAID}
                    >
                      Marcar como pago
                    </Button>
                  </If>

                  <If condition={bill.status !== BillStatus.PENDING}>
                    <Button
                      w="210px"
                      variant="ghost"
                      leftIcon={<IoMdCalendar />}
                      justifyContent="flex-start"
                      fontWeight="normal"
                      fontSize="sm"
                      onClick={() => changeBillStatus(BillStatus.PENDING)}
                      isLoading={loadings?.changingStatus === BillStatus.PENDING}
                    >
                      Marcar como pendente
                    </Button>
                  </If>

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
                    leftIcon={<DeleteIcon />}
                    justifyContent="flex-start"
                    fontWeight="normal"
                    colorScheme="red"
                    fontSize="sm"
                    onClick={() => deleteBill()}
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
