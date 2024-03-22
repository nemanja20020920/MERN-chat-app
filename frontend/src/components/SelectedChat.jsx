import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  InputGroup,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { getChatName } from '../utils/chat';
import EditGroupChatModal from './EditGroupChatModal';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { chatActions } from '../store/chat';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ScrollableFeed from 'react-scrollable-feed';
import SingleMessage from './SingleMessage';
import axios from 'axios';

var socket, selectedChatCompare;

const SelectedChat = ({ onFetchAgain }) => {
  //State
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([]);
  //Store
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const userData = useSelector((state) => state.user);

  //Hooks
  const dispatch = useDispatch();
  const toast = useToast();

  //Functions
  const goBackHandler = () => dispatch(chatActions.setSelectedChat({}));

  //Functions
  const sendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`,
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/messages`,
        {
          content: messageContent.trim(),
          chatId: selectedChat._id,
        },
        config
      );

      socket.emit('new message', data);
      setMessages((prevVal) => [...prevVal, data]);
      setMessageContent('');
      onFetchAgain();
    } catch (error) {
      toast({
        title: 'An Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        position: 'top',
        isClosable: true,
      });
    }
  };

  const fetchMessages = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/messages/${selectedChat._id}`,
        config
      );

      setMessages([...data]);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'An Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        position: 'top',
        isClosable: true,
      });
    }
  };

  //Onload
  useEffect(() => {
    socket = io('http://192.168.1.46:5000');
    socket.emit('setup', userData);
  }, []);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      )
        return;

      setMessages((prevVal) => [...prevVal, newMessageReceived]);
    });
  }, []);

  //On chat change
  useEffect(() => {
    if (selectedChat?._id) {
      fetchMessages();

      selectedChatCompare = selectedChat;
    }
  }, [selectedChat]);

  return (
    <Box
      w={{ base: '100%', md: '70%' }}
      bgColor="white"
      borderRadius={20}
      p={5}
      display={{ base: selectedChat?.name ? 'flex' : 'none', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      justifyContent="center"
    >
      {selectedChat?.name ? (
        <>
          <HStack w="100%" justifyContent="space-between">
            <HStack>
              <Button
                display={{ base: 'inline-block', md: 'none' }}
                onClick={goBackHandler}
              >
                <ArrowBackIcon />
              </Button>
              <Text textAlign="left" fontSize={25}>
                {getChatName(selectedChat, userData._id)}
              </Text>
            </HStack>

            {selectedChat?.isGroupChat && (
              <EditGroupChatModal
                selectedChat={selectedChat}
                onFetchAgain={onFetchAgain}
              />
            )}
          </HStack>
          <Box
            mt={3}
            h="100%"
            w="100%"
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            overflowY="hidden"
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'scroll',
                scrollbarWidth: 'none',
              }}
            >
              <ScrollableFeed className="scroll-hidden">
                {messages.map((message, index) => (
                  <SingleMessage
                    key={message._id}
                    messages={messages}
                    message={message}
                    index={index}
                  />
                ))}
              </ScrollableFeed>
            </div>
            <FormControl
              onKeyDown={(e) => (e.key === 'Enter' ? sendMessage() : null)}
            >
              <InputGroup mt={3}>
                <Input
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Type message..."
                />
                <Button ms={2} colorScheme="messenger" onClick={sendMessage}>
                  Send
                </Button>
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <Text fontSize="30px">
          Open a chat from the chats list to see messages
        </Text>
      )}
    </Box>
  );
};

export default SelectedChat;
