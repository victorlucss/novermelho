import { BillTypes } from '@Modules/Bill/constants/Types';
import { firestore } from '@Configs/Firebase';

const expenseCategories = [
  {
    name: '💳 Cartão de crédito',
    color: '#000000',
    type: BillTypes.EXPENSE,
  },
  {
    name: '💰 Investimento',
    color: '#000000',
    type: BillTypes.EXPENSE,
  },
  {
    name: '💸 Fixo',
    color: '#000000',
    type: BillTypes.EXPENSE,
  },
  {
    name: '🔁 Flexível',
    color: '#000000',
    type: BillTypes.EXPENSE,
  },
];

const incomeCategories = [
  {
    name: '💰 Salário',
    color: '#000000',
    type: BillTypes.INCOME,
  },
  {
    name: '💸 Veaco',
    color: '#000000',
    type: BillTypes.INCOME,
  },
  {
    name: '💲 Outro',
    color: '#000000',
    type: BillTypes.INCOME,
  },
];

export const createDefaultCategories = async userId => {
  if (!userId) return;

  const defaultCategories = [...expenseCategories, ...incomeCategories];
  let createBatchCategories = [];

  defaultCategories.forEach(category =>
    createBatchCategories.push(
      firestore.collection('categories').add({
        ...category,
        userId,
      })
    )
  );

  return Promise.all(createBatchCategories);
};
