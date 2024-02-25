import { Box, HStack, Text, VStack, useToast } from '@chakra-ui/react';
import GroupChatModal from './GroupChatModal';
import SingleChat from './SingleChat';
import '../App.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../config';

const ChatsList = () => {
  //State
  const [chats, setChats] = useState([]);

  //Store
  const userData = useSelector((state) => state.user);

  //Hooks
  const toast = useToast();

  //On User Data Change
  useEffect(() => {
    fetchChats();
  }, [userData]);

  //Functions
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/chats/fetchChats`, config);

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
    <Box
      flexBasis="30%"
      width="100%"
      height="100%"
      bgColor="white"
      borderRadius={20}
      p={5}
    >
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize={25}>Your Chats</Text>

        <GroupChatModal />
      </HStack>

      <VStack overflowY="scroll" maxHeight="76vh" className="scroll-hidden">
        {chats.map((chat) => (
          <SingleChat key={chat._id} chat={chat} />
        ))}
      </VStack>
    </Box>
  );
};

export default ChatsList;
