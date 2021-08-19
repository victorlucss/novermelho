import { useRouter } from 'next/router';

import { useUser } from '@Modules/Authentication/context/UserContext';

const withAuth = WrappedComponent => {
  return props => {
    if (typeof window !== 'undefined') {
      const Router = useRouter();
      const { userId } = useUser();

      if (!userId) {
        Router.replace('/login');
        return null;
      }

      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withAuth;
