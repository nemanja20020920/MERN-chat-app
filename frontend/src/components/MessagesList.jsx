import {
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  useToast,
} from '@chakra-ui/react';
import '../App.css';
import ScrollableFeed from 'react-scrollable-feed';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../config';
import SingleMessage from './SingleMessage';

const MessagesList = ({ onFetchAgain }) => {
  //State
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState([]);

  //Store
  const userData = useSelector((state) => state.user);
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  //Hooks
  const toast = useToast();

  //Functions
  const sendMessage = async () => {
    if (!messageContent.trim())
      return toast({
        title: 'Missing content!',
        description: 'Enter the message content',
        status: 'warning',
        duration: 5000,
        position: 'top',
        isClosable: true,
      });

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`,
        },
      };

      const { data } = await axios.post(
        `${API_URL}/messages`,
        {
          content: messageContent.trim(),
          chatId: selectedChat._id,
        },
        config
      );

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
        `${API_URL}/messages/${selectedChat._id}`,
        config
      );

      console.log(data);
      setMessages([...data]);
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
    fetchMessages();
  }, [selectedChat]);

  return (
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
  );
};

export default MessagesList;
