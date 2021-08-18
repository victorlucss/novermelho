import { useState, useMemo } from "react";
import { Bill } from "@Modules/Bill/interfaces/Bill.interface";

import { useRouter } from 'next/router';
import { BillTypes, BillStatus } from "@Modules/Bill/constants/Types";
import { Button, IconButton, Box, Text, Tag, Flex, Stack, Spacer } from "@chakra-ui/react"
import { EditIcon, DeleteIcon, ArrowUpIcon, ArrowDownIcon } from '@chakra-ui/icons'

import { billsCollection } from '@Modules/Bill/constants/FirestoreCollections'

interface BillItemProps {
  bill: Bill
}

export default function BillItem({ bill }: BillItemProps) {
  const router = useRouter();
  const [loadings, setLoadings] = useState({
    changingStatus: null,
    deleting: false
  })


  const formatValue = (value) => {
    return `R$${Number(value).toFixed(2).replace('.', ',')}`
  }

  const formatDate = (value) => {
    const date = new Date(value).toLocaleString('pt-BR').substr(0, 10)
    return `${date}`
  }

  const billValue = useMemo(() => {
    const typesScheme = {
      [BillTypes.EXPENSE]: 'red',
      [BillTypes.INCOME]: 'green'
    }

    const icon = {
      [BillTypes.EXPENSE]: <ArrowDownIcon color='red' />,
      [BillTypes.INCOME]: <ArrowUpIcon color='green' />
    }

    return <Tag colorScheme={typesScheme[bill.type]} color={typesScheme[bill.type]}>{icon[bill.type] ?? <></>} {formatValue(bill.value)}</Tag>
  }, [bill])

  const changeBillStatus = async (status) => {
    setLoadings({
      ...loadings,
      changingStatus: status
    })

    await billsCollection.doc(bill.id).update({
      status
    })

    setLoadings({
      ...loadings,
      changingStatus: null
    })
  }

  const deleteBill = async () => {
    setLoadings({
      ...loadings,
      deleting: true
    })

    await billsCollection.doc(bill.id).delete()

    setLoadings({
      ...loadings,
      changingStatus: false
    })
  }

  return (
    <Box w="100%" p={4} marginBottom="10px"  borderWidth="1px" borderRadius="lg">
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing="3">
          <Flex direction="row" alignItems="center">
            <Text fontSize="xl" as="b">{bill.name}</Text>
            <Text fontSize="sm" color="gray.300" marginLeft="10px">Due date {formatDate(bill.dueDate)}</Text>
          </Flex>

          {bill.description && <Text fontSize="sm" color="gray.300">{bill.description}</Text>}

          <div>{billValue}</div>

          <Text fontSize="xs" color="gray">Created at {formatDate(bill.createdAt)}</Text>
        </Stack>

        <Flex alignItems="center">
          <Flex direction="column" marginRight="10px">
            <Button
              size="xs"
              variant={bill.status === BillStatus.PENDING ? 'solid' : 'outline'}
              onClick={() => changeBillStatus(BillStatus.PENDING)}
              isLoading={loadings?.changingStatus === BillStatus.PENDING}
              colorScheme="yellow">
              Pending
            </Button>

            <Button
              size="xs"
              variant={bill.status === BillStatus.PAID ? 'solid' : 'outline'}
              onClick={() => changeBillStatus(BillStatus.PAID)}
              isLoading={loadings?.changingStatus === BillStatus.PAID}
              colorScheme="green"
              marginTop="5px">
                Paid
            </Button>

            <Button
              size="xs"
              variant={bill.status === BillStatus.NOT_PAID ? 'solid' : 'outline'}
              onClick={() => changeBillStatus(BillStatus.NOT_PAID)}
              isLoading={loadings?.changingStatus === BillStatus.NOT_PAID}
              colorScheme="red"
              marginTop="5px">
              Not paid
            </Button>
          </Flex>

          <IconButton
            aria-label="Edit bill"
            icon={<EditIcon />}
            onClick={() => router.push(`/bill/${bill.id}`)}
            variant="outline"
            size="sm" />

          <IconButton
            aria-label="Delete bill"
            colorScheme="red"
            color="red.500"
            onClick={() => deleteBill()}
            icon={<DeleteIcon />}
            variant="outline"
            marginLeft="10px" 
            size="sm" />
        </Flex>

      </Flex>
    </Box>
  )
}