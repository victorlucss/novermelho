import React from 'react';
import { useRouter } from 'next/router';

import withLateralMenu from '@/hoc/withLateralMenu';
import { FormCategoryContainer } from '@Modules/Category/container/form-category.container';

const FormCategory = () => {
  return (
    <>
      <FormCategoryContainer />
    </>
  );
};

export default withLateralMenu(FormCategory);
