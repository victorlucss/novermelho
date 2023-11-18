import { useMemo } from 'react';
import { Stat, StatLabel, StatNumber, Box, Flex, Grid, GridItem } from '@chakra-ui/react';

import { Bill } from '@Modules/Bill/interfaces/Bill.interface';
import { BillTypes } from '@Modules/Bill/constants/Types';

interface StateMonthProps {
  income?: number;
  expense?: number;
  balance?: number;
}

export const StatsMonth = ({ income, expense, balance }: StateMonthProps) => {
  const formatValue = value => {
    return `R$${Number(value).toFixed(2).replace('.', ',')}`;
  };

  return (
    <Grid templateColumns="repeat(3, 1fr)" overflowX="auto" gap={4} mb={4}>
      <GridItem>
        <Box w="100%" p={4} borderWidth="1px" borderRadius="lg">
          <Stat>
            <StatLabel color="green.500">Income</StatLabel>
            <StatNumber color="green.500">{formatValue(income)}</StatNumber>
          </Stat>
        </Box>
      </GridItem>

      <GridItem>
        <Box w="100%" p={4} borderWidth="1px" borderRadius="lg">
          <Stat>
            <StatLabel color="red.500">Expense</StatLabel>
            <StatNumber color="red.500">{formatValue(expense)}</StatNumber>
          </Stat>
        </Box>
      </GridItem>

      <GridItem>
        <Box w="100%" p={4} borderWidth="1px" borderRadius="lg">
          <Stat>
            <StatLabel color="blue.500">Balance</StatLabel>
            <StatNumber color="blue.500">{formatValue(balance)}</StatNumber>
          </Stat>
        </Box>
      </GridItem>
    </Grid>
  );
};
