import { Navigate } from 'react-router-dom';

const Protected = ({ authRequired, children }) => {
  const userData = JSON.parse(localStorage.getItem('userData'));

  if (authRequired && !userData?.token) return <Navigate to={'/'} />;
  if (!authRequired && userData?.token) return <Navigate to={'/home'} />;
  return children;
};

export default Protected;
