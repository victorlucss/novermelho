import { useMemo } from "react";
import { Bill } from "@Modules/Bill/interfaces/Bill.interface";

import {
  Stat,
  StatLabel,
  StatNumber,
  Box,
  Flex
} from "@chakra-ui/react"
import { BillTypes } from "@Modules/Bill/constants/Types";

interface StateMonthProps {
  bills: Bill[]
}

export default function StateMonth({ bills }: StateMonthProps) {
  const formatValue = (value) => {
    return `R$${Number(value).toFixed(2).replace('.', ',')}`
  }

  const income = useMemo(() => {
    const reduceRevenue = bills.filter(bill => bill.type === BillTypes.INCOME).reduce((prev, current) => prev += current.value, 0) ?? 0
    return formatValue(reduceRevenue)
  }, [bills])

  const expense = useMemo(() => {
    const reduceExpense = bills.filter(bill => bill.type === BillTypes.EXPENSE).reduce((prev, current) => prev += current.value, 0) ?? 0
    return formatValue(reduceExpense)
  }, [bills])

  const balance = useMemo(() => {
    const reduceRevenue = bills.filter(bill => bill.type === BillTypes.INCOME).reduce((prev, current) => prev += current.value, 0) ?? 0
    const reduceExpense = bills.filter(bill => bill.type === BillTypes.EXPENSE).reduce((prev, current) => prev += current.value, 0) ?? 0
    return formatValue(reduceRevenue - reduceExpense)
  }, [bills])


  return (
    <Box w="100%" p={4} marginBottom="10px"  borderWidth="1px" borderRadius="lg">
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Stat>
          <StatLabel color="green.500">Income</StatLabel>
          <StatNumber color="green.500">{income}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel color="red.500">Expense</StatLabel>
          <StatNumber color="red.500">{expense}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel color="blue.500">Balance</StatLabel>
          <StatNumber color="blue.500">{balance}</StatNumber>
        </Stat>
      </Flex>
    </Box>
  )
}