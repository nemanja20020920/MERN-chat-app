import { useDispatch } from 'react-redux';
import Navbar from '../components/Navbar';
import { userActions } from '../store/user';
import { useEffect } from 'react';

const Home = () => {
  //Hooks
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData && userData.token) {
      dispatch(userActions.setUser({ ...userData }));
    }
  }, []);

  return <Navbar>Home</Navbar>;
};

export default Home;
