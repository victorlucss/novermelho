import { firestore } from '@Configs/Firebase';

export const billsCollection = firestore.collection('bills');
export const budgetsCollection = firestore.collection('budgets');
