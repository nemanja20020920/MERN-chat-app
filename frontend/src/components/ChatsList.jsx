import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import GroupChatModal from './GroupChatModal';
import SingleChat from './SingleChat';
import '../App.css';
import { useSelector } from 'react-redux';

const ChatsList = ({ chats }) => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  return (
    <Box
      flexBasis={{ base: '100%', md: '30%' }}
      width="100%"
      height="100%"
      bgColor="white"
      borderRadius={20}
      p={5}
      display={{ base: selectedChat?.name ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
    >
      <HStack justifyContent="space-between" mb={4}>
        <Text fontSize={25}>Your Chats</Text>

        <GroupChatModal />
      </HStack>

      <VStack overflowY="scroll" className="scroll-hidden">
        {chats.map((chat) => (
          <SingleChat key={chat._id} chat={chat} />
        ))}
      </VStack>
    </Box>
  );
};

export default ChatsList;
