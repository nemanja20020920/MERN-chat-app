import { Box, Text } from '@chakra-ui/react';
import { getChatName } from '../utils/chat';
import { useDispatch, useSelector } from 'react-redux';
import { chatActions } from '../store/chat';

const SingleChat = ({ chat }) => {
  //Store
  const userId = useSelector((state) => state.user._id);

  //Hooks
  const dispatch = useDispatch();

  //Functions
  const selectChatHandler = () =>
    dispatch(chatActions.setSelectedChat({ ...chat }));

  return (
    <Box
      width="100%"
      borderRadius={10}
      border="2px solid rgb(200, 200, 200)"
      bgColor="rgb(250, 250, 250)"
      p={2}
      textAlign="left"
      _hover={{ cursor: 'pointer', backgroundColor: 'rgb(200, 200, 200)' }}
      onClick={selectChatHandler}
    >
      <Text fontSize="18px" as="b">
        {getChatName(chat, userId)}
      </Text>
      {chat?.latestMessage && (
        <Text maxW="90%" wordBreak="break-all" fontSize="15px">
          <Text as="b">{chat?.latestMessage?.sender.fullName}: </Text>
          {chat?.latestMessage?.content.slice(0, 30)}
          {chat?.latestMessage?.content.length > 30 && '...'}
        </Text>
      )}
    </Box>
  );
};

export default SingleChat;
