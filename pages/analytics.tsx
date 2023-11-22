import withLateralMenu from '@/hoc/withLateralMenu';
import { ListAnalyticsContainer } from '@Modules/Analytics/container/list-analytics.container';

const Analytics = () => {
  return <ListAnalyticsContainer />;
};

export default withLateralMenu(Analytics);
