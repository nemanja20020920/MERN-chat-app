import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { getChatName } from '../utils/chat';
import EditGroupChatModal from './EditGroupChatModal';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { chatActions } from '../store/chat';
import MessagesList from './MessagesList';

const SelectedChat = ({ onFetchAgain }) => {
  //Store
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const userData = useSelector((state) => state.user);

  //Hooks
  const dispatch = useDispatch();

  //Functions
  const goBackHandler = () => dispatch(chatActions.setSelectedChat({}));

  return (
    <Box
      flexBasis={{ base: '100%', md: '70%' }}
      w="100%"
      bgColor="white"
      borderRadius={20}
      p={5}
      display={{ base: selectedChat?.name ? 'flex' : 'none', md: 'flex' }}
      flexDir="column"
    >
      {selectedChat?.name ? (
        <>
          <HStack justifyContent="space-between">
            <HStack>
              <Button
                display={{ base: 'inline-block', md: 'none' }}
                onClick={goBackHandler}
              >
                <ArrowBackIcon />
              </Button>
              <Text fontSize={25}>
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
          <MessagesList onFetchAgain={onFetchAgain} />
        </>
      ) : (
        <Text>No chat</Text>
      )}
    </Box>
  );
};

export default SelectedChat;
