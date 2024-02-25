import { Avatar, Box, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from '../config';
import { chatActions } from '../store/chat';

const SingleUser = ({ user, onClose }) => {
  //Store
  const userData = useSelector((state) => state.user);

  //Hooks
  const dispatch = useDispatch();

  //Functions
  const accessChatHandler = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData.token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/chats`,
      {
        userId: user._id,
      },
      config
    );

    dispatch(chatActions.setSelectedChat({ ...data }));
    onClose();
  };

  return (
    <Box
      py="5px"
      width="100%"
      border="2px solid rgb(200, 200, 200)"
      borderRadius={5}
      mt="5px"
      p={2}
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      gap="20px"
      _hover={{ cursor: 'pointer' }}
      onClick={accessChatHandler}
    >
      <Avatar size="sm" src={user?.pic} />
      <Text>{user?.fullName}</Text>
    </Box>
  );
};

export default SingleUser;
