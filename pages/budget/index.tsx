import React from 'react';

import withLateralMenu from '@/hoc/withLateralMenu';
import { ListBudgetContainer } from '@Modules/Budget/container/list-budget.container';

const Budget = () => {
  return <ListBudgetContainer />;
};

export default withLateralMenu(Budget);
