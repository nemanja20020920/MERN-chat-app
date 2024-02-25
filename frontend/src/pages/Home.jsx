import Navbar from '../components/Navbar';
import { HStack } from '@chakra-ui/react';
import ChatsList from '../components/ChatsList';
import SelectedChat from '../components/SelectedChat';

const Home = () => {
  return (
    <>
      <Navbar />
      <HStack p="20px" height="91vh" width="100vw" bgColor="rgb(100, 100, 100)">
        <ChatsList />

        <SelectedChat />
      </HStack>
    </>
  );
};

export default Home;
