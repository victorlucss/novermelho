import dynamic from 'next/dynamic';

// @ts-ignore
const ResponsivePieCanvas = dynamic(() => import('@nivo/pie').then(m => m.ResponsivePieCanvas), { ssr: false });

import { Text, Box as ChackraBox, Tag } from '@chakra-ui/react';
import { useMemo } from 'react';

import { Box } from '@Components';
import { ICategory } from '@/hooks/useCategories';
import { IBill } from '@/hooks/useBills';
import { BillTypes } from '@Modules/Bill/constants/Types';

interface CategoriesCurrentMonthProps {
  bills: IBill[];
  categories: ICategory[];
}

const keyToText = {
  rest: 'Retante',
  income: 'Receita',
  expense: 'Despesa',
};

export const CategoriesCurrentMonth = ({ bills, categories }: CategoriesCurrentMonthProps) => {
  const graphData = useMemo(() => {
    return bills?.map(bill => {
      return {
        value: bill.value,
        id: categories?.find(({ id }) => id === bill.category)?.name || 'Outro',
      };
    });
  }, [bills, categories]);

  const data = [
    {
      id: 'Cartão de crédito',
      value: 440,
    },
    {
      id: 'Investimento',
      value: 251,
    },
    {
      id: 'Outros',
      value: 464,
    },
  ];
  return (
    <Box bg="gray.300">
      <Text fontSize="lg" fontWeight="bold" color="gray.600">
        Gastos por categoria
      </Text>
      <ChackraBox height="400px">
        {/* @ts-ignore */}
        <ResponsivePieCanvas
          // @ts-ignore
          data={graphData}
          margin={{ top: 10, right: 50, bottom: 80, left: 50 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [['darker', 2]],
          }}
          tooltip={() => <></>}
        />
      </ChackraBox>
    </Box>
  );
};
