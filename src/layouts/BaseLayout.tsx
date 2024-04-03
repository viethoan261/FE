import { ROUTER } from '@/configs/router';
import { Navigate, useOutlet } from 'react-router-dom';

const BaseLayout = () => {
  const outlet = useOutlet();

  const user = 'dfdf';

  if (!user) {
    return <Navigate to={ROUTER.BASE} replace />;
  }

  return <div className="app-container">{outlet}</div>;
};

export default BaseLayout;
