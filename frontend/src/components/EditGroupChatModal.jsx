import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserBadge from './UserBadge';
import SingleUser from './SingleUser';
import axios from 'axios';
import { chatActions } from '../store/chat';

const EditGroupChatModal = ({ selectedChat, onFetchAgain }) => {
  //Store
  const userData = useSelector((state) => state.user);

  //State
  const [groupName, setGroupName] = useState(selectedChat.name);
  const [users, setUsers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([...selectedChat.users]);

  //Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    setGroupMembers([...selectedChat.users]);
    setGroupName(selectedChat.name);
    setUsers([]);
  }, [selectedChat]);

  //Functions
  const renameGroupChatHandler = async () => {
    if (!groupName.trim())
      return toast({
        title: 'Enter The Group Name!',
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

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/chats/renameGroup`,
        {
          name: groupName.trim(),
          groupId: selectedChat._id,
        },
        config
      );

      setGroupName('');
      setGroupMembers([...data.users]);
      dispatch(chatActions.setSelectedChat({ ...data }));
      onFetchAgain();
    } catch (error) {
      toast({
        title: 'An Error Occured',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        position: 'top',
        isClosable: true,
      });
    }
  };

  const searchUsersHandler = async (query) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users?search=${query.trim()}`,
        config
      );

      setUsers([...data]);
      onFetchAgain();
    } catch (error) {
      toast({
        title: 'An Error Occured',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        position: 'top',
        isClosable: true,
      });
    }
  };

  const addUserToGroupHandler = async (user) => {
    const groupMemberIds = groupMembers.map((member) => member._id);
    if (groupMemberIds.includes(user._id))
      return toast({
        title: 'Already In Group',
        description: 'The user is already in the group',
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

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/chats/addToGroup`,
        {
          groupId: selectedChat._id,
          userId: user._id,
        },
        config
      );

      dispatch(chatActions.setSelectedChat({ ...data }));
      setGroupMembers((prevVal) => [...prevVal, user]);
      onFetchAgain();
    } catch (error) {
      toast({
        title: 'An Error Occured',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        position: 'top',
        isClosable: true,
      });
    }
  };

  const removeUserFromGroupHandler = async (userId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`,
        },
      };

      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/chats/removeFromGroup`,
        {
          groupId: selectedChat._id,
          userId,
        },
        config
      );

      dispatch(chatActions.setSelectedChat({ ...data }));
      setGroupMembers((prevVal) => [
        ...prevVal.filter((member) => member._id !== userId),
      ]);
      onFetchAgain();
    } catch (error) {
      toast({
        title: 'An Error Occured',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        position: 'top',
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button colorScheme="gray" onClick={onOpen}>
        <EditIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {groupMembers.map((member) => (
              <UserBadge
                key={member._id}
                user={member}
                onUserRemove={() => removeUserFromGroupHandler(member._id)}
              />
            ))}
            <InputGroup my={3}>
              <Input
                type="text"
                placeholder="Group Chat Name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button
                ms={2}
                px={5}
                colorScheme="messenger"
                onClick={renameGroupChatHandler}
              >
                Change Name
              </Button>
            </InputGroup>
            <InputGroup>
              <Input
                type="text"
                placeholder="Search Users..."
                onChange={(e) => searchUsersHandler(e.target.value)}
              />
            </InputGroup>
            {users?.slice(0, 3).map((user) => (
              <SingleUser
                key={user._id}
                user={user}
                onClick={() => addUserToGroupHandler(user)}
              />
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditGroupChatModal;
