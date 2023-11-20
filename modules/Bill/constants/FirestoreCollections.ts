import { firestore } from '@Configs/Firebase';

export const billsCollection = firestore.collection('bills');

export const billsRecurrenceCollection = firestore.collection('bills-recurrence');
