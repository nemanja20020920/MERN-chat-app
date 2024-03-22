import Navbar from '../components/Navbar';
import { Box, useToast } from '@chakra-ui/react';
import ChatsList from '../components/ChatsList';
import SelectedChat from '../components/SelectedChat';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Home = () => {
  //State
  const [chats, setChats] = useState([]);

  //Store
  const userData = useSelector((state) => state.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  //Hooks
  const toast = useToast();

  //On User Data Change
  useEffect(() => {
    fetchChats();
  }, [userData, selectedChat]);

  //Functions
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/chats/fetchChats`,
        config
      );

      setChats([...data]);
    } catch (error) {
      toast({
        title: 'Failed To Fetch!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <>
      <Navbar />
      <Box
        display="flex"
        p="20px"
        justifyContent="space-between"
        height="91vh"
        width="100vw"
        gap="10px"
        bgColor="rgb(100, 100, 100)"
      >
        <ChatsList chats={chats} />

        <SelectedChat onFetchAgain={fetchChats} />
      </Box>
    </>
  );
};

export default Home;
