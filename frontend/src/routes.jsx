import Home from './pages/Home';
import Login from './pages/Login';
import Protected from './pages/Protected';
import Register from './pages/Register';

const routes = [
  {
    index: true,
    element: (
      <Protected authRequired={false}>
        <Login />
      </Protected>
    ),
  },
  {
    path: '/register',
    element: (
      <Protected authRequired={false}>
        <Register />
      </Protected>
    ),
  },
  {
    path: '/home',
    element: (
      <Protected authRequired={true}>
        <Home />
      </Protected>
    ),
  },
];

export default routes;
