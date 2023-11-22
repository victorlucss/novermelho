import dynamic from 'next/dynamic';

// @ts-ignore
const ResponsiveBarCanvas = dynamic(() => import('@nivo/bar').then(m => m.ResponsiveBarCanvas), { ssr: false });

import { Text, Box as ChackraBox, Tag } from '@chakra-ui/react';
import { useMemo } from 'react';

import { Box } from '@Components';
import { IBill } from '@/hooks/useBills';
import { BillTypes } from '@Modules/Bill/constants/Types';

interface MonthByMonthProps {
  bills: IBill[];
}

const keyToText = {
  rest: 'Retante',
  income: 'Receita',
  expense: 'Despesa',
};

export const MonthByMonth = ({ bills }: MonthByMonthProps) => {
  const data = useMemo(() => {
    const billsReduce = bills.reduce((prev, curr) => {
      const dueDate = new Date(curr.dueDate);
      const month = `${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`;

      if (!prev[month]) {
        prev[month] = {};

        if (curr.type === BillTypes.EXPENSE) {
          prev[month] = {
            expense: curr.value,
            income: 0,
            month,
          };
        } else {
          prev[month] = {
            expense: 0,
            income: curr.value,
            month,
          };
        }

        prev[month].rest = prev[month].income - prev[month].expense;
      }

      if (prev?.[month]) {
        if (curr.type === BillTypes.EXPENSE) {
          prev[month].expense += curr.value;
        } else {
          prev[month].income += curr.value;
        }

        prev[month].rest = prev[month].income - prev[month].expense;
      }

      return prev;
    }, {});

    return Object.values(billsReduce);
  }, [bills]);

  return (
    <Box bg="gray.300">
      <Text fontSize="lg" fontWeight="bold" color="gray.600">
        Últimos meses
      </Text>
      <ChackraBox height="400px">
        {/* @ts-ignore */}
        <ResponsiveBarCanvas
          // @ts-ignore
          data={data}
          keys={['income', 'expense', 'rest']}
          indexBy="month"
          margin={{ top: 10, right: 60, bottom: 50, left: 60 }}
          groupMode="grouped"
          layout="vertical"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={['#38A169', '#E53E3E', '#3182ce']}
          colorBy="id"
          enableGridX={false}
          enableGridY={false}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          tooltip={item => {
            return (
              <Tag fontSize="xx-small" variant="solid">
                {keyToText[item.id]} {item.value}
              </Tag>
            );
          }}
        />
      </ChackraBox>
    </Box>
  );
};
