import React from 'react';

import { ListCategoriesContainer } from '@Modules/Category/container/list-categories.container';
import withLateralMenu from '@/hoc/withLateralMenu';

const Category = () => {
  return <ListCategoriesContainer />;
};

export default withLateralMenu(Category);
