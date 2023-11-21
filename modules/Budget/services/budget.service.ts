import { budgetsCollection } from '@Configs/collections.config';

export interface IBudget {
  id?: string;
  name: string;
  value: number;
  userId: string;
  categoryId: string;
}

export const getAllBudgets = (userId: string, setItems) => {
  return budgetsCollection
    .where('userId', '==', userId)
    .onSnapshot(({ docs }) => setItems(docs.map(budget => ({ id: budget.id, ...budget.data() } as IBudget))));
};

export const getOneBudget = id => {
  return budgetsCollection
    .doc(id)
    .get()
    .then(res => res.data());
};

export const updateBudget = (id: string, budget: IBudget) => {
  return budgetsCollection.doc(id).update(budget);
};

export const verifyExistsBudgetCategory = (userId, categoryId) => {
  return budgetsCollection
    .where('userId', '==', userId)
    .where('categoryId', '==', categoryId)
    .limit(1)
    .get()
    .then(({ empty }) => !empty);
};

export const createBudget = (budget: IBudget) => {
  return budgetsCollection.add(budget);
};

export const deleteBudget = (id: string) => {
  return budgetsCollection.doc(id).delete();
};
