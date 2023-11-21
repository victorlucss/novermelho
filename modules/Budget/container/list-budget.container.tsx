import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@chakra-ui/button';
import { Badge, Link } from '@chakra-ui/react';

import { Box } from '@Components';
import BaseList from '@Modules/BaseModule/container/BaseList';
import { BillTypes } from '@Modules/Bill/constants/Types';
import { useUser } from '@Authentication/context/UserContext';
import { deleteBudget, getAllBudgets, IBudget } from '@Modules/Budget/services/budget.service';
import { useCategories } from '@Modules/Category/hooks/useCategories';
import { FormBudget } from '@Modules/Budget/components/form-budget.component';

export const ListBudgetContainer = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();
  const categories = useCategories({ type: BillTypes.EXPENSE });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const budgets = await getAllBudgets(userId, setItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onDeleteItem = id => {
    deleteBudget(id);
  };

  const renderCategory = useCallback(
    categoryId => {
      const foundCategory = categories?.find(({ id }) => id === categoryId);

      if (!foundCategory) <></>;

      return <Badge bg={foundCategory?.color}>{foundCategory?.name}</Badge>;
    },
    [categories]
  );

  return (
    <Box>
      <Link href="/budget/create">
        <Button mb={5}>Criar orçamento</Button>
      </Link>

      <BaseList<IBudget>
        headers={[
          {
            label: 'Nome',
            field: 'name',
          },
          {
            label: 'Valor',
            field: 'value',
            render: ({ value }) => <>R${Number(value).toFixed(2).replace('.', ',')}</>,
          },

          {
            label: 'Categoria',
            field: 'categoryId',
            render: ({ categoryId }) => renderCategory(categoryId),
          },
        ]}
        items={items}
        isLoading={false}
        editComponent={id => <FormBudget id={id} />}
        onDeleteItem={onDeleteItem}
        optionsEnabled
      />
    </Box>
  );
};
