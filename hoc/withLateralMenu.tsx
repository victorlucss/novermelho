import { LateralMenu } from '@Components/LateralMenu';

const withLateralMenu = Children => {
  return props => (
    <LateralMenu>
      <Children {...props} />
    </LateralMenu>
  );
};

export default withLateralMenu;
