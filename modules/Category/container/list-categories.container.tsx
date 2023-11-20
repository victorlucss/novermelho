import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@chakra-ui/button';
import { Badge, Link } from '@chakra-ui/react';

import { FormCategory } from '@Modules/Category/components/form-category.component';
import BaseList from '@Modules/BaseModule/container/BaseList';
import { firestore } from '@Configs/Firebase';
import { BillTypes } from '@Modules/Bill/constants/Types';
import { useUser } from "@Authentication/context/UserContext";

interface ICategory {
  id?: string;
  name: string;
  color: string;
}

const billTypesText = {
  [BillTypes.EXPENSE]: 'Despesa',
  [BillTypes.INCOME]: 'Receita',
};
export const ListCategoriesContainer = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();

  const fetchData = useCallback(async () => {
    firestore.collection('categories').where('userId', '==', userId).onSnapshot(({ docs }) => {
      setLoading(true);
      setItems(docs.map(category => ({ id: category.id, ...category.data() } as ICategory)));
    });
    }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onDeleteItem = id => {
    firestore.collection('categories').doc(id).delete();
  };

  return (
    <>
      <Link href="/category/create">
        <Button>Criar categoria</Button>
      </Link>

      <BaseList<ICategory>
        headers={[
          {
            label: 'Nome',
            field: 'name',
            render: item => <Badge bg={item.color}>{item.name}</Badge>,
          },
          {
            label: 'Tipo',
            field: 'type',
            render: item => <>{billTypesText[item.type]}</>,
          },
        ]}
        items={items}
        isLoading={false}
        editComponent={id => <FormCategory id={id} />}
        onDeleteItem={onDeleteItem}
        optionsEnabled
      />
    </>
  );
};
