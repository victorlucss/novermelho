import withLateralMenu from '@/hoc/withLateralMenu';
import { FormBudgetContainer } from '@Modules/Budget/container/form-budget.container';

const FormBudget = () => {
  return (
    <>
      <FormBudgetContainer />
    </>
  );
};

export default withLateralMenu(FormBudget);
