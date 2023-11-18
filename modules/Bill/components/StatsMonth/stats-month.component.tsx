import { Stat, StatLabel, StatNumber, Box, Grid, GridItem, Skeleton } from '@chakra-ui/react';

interface StateMonthProps {
  income?: number;
  expense?: number;
  balance?: number;
  isLoaded: boolean;
}

export const StatsMonth = ({ income, expense, balance, isLoaded }: StateMonthProps) => {
  const formatValue = value => {
    return `R$${Number(value).toFixed(2).replace('.', ',')}`;
  };

  return (
    <Grid templateColumns="repeat(3, 1fr)" overflowX="auto" gap={4} mb={4}>
      <GridItem>
        <Box w="100%" p={4} borderWidth="1px" borderRadius="lg" bg="#2C3A3A">
          <Stat>
            <Skeleton width="100px" height="20px" isLoaded={isLoaded}>
              <StatLabel color="green.500">Receita</StatLabel>
            </Skeleton>
            <Skeleton width="120px" height="30px" isLoaded={isLoaded} mt={1}>
              <StatNumber color="green.500">{formatValue(income)}</StatNumber>
            </Skeleton>
          </Stat>
        </Box>
      </GridItem>

      <GridItem>
        <Box w="100%" p={4} borderWidth="1px" borderRadius="lg" bg="#3B313A">
          <Stat>
            <Skeleton width="100px" height="20px" isLoaded={isLoaded}>
              <StatLabel color="red.500">Despesas</StatLabel>
            </Skeleton>
            <Skeleton width="120px" height="30px" isLoaded={isLoaded} mt={1}>
              <StatNumber color="red.500">{formatValue(expense)}</StatNumber>
            </Skeleton>
          </Stat>
        </Box>
      </GridItem>

      <GridItem>
        <Box w="100%" p={4} borderWidth="1px" borderRadius="lg" bg="#2A3645">
          <Stat>
            <Skeleton width="100px" height="20px" isLoaded={isLoaded}>
              <StatLabel color="blue.500">Restante</StatLabel>
            </Skeleton>
            <Skeleton width="120px" height="30px" isLoaded={isLoaded} mt={1}>
              <StatNumber color="blue.500">{formatValue(balance)}</StatNumber>
            </Skeleton>
          </Stat>
        </Box>
      </GridItem>
    </Grid>
  );
};
