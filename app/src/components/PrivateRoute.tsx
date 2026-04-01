/**
 * PrivateRoute — redirects to /login if the static session is not active.
 * Passes `from` so StaticLoginPage can redirect back after login.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { isStaticAuthenticated } from '../auth.static';

interface Props {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const location = useLocation();

  if (!isStaticAuthenticated()) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
}
