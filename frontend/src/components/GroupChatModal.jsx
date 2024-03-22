import { AddIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  InputGroup,
  Input,
  useToast,
} from '@chakra-ui/react';
import SingleUser from './SingleUser';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserBadge from './UserBadge';
import { chatActions } from '../store/chat';

const GroupChatModal = () => {
  //State
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  //Store
  const userData = useSelector((state) => state.user);

  //Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();

  //Functions
  const createGroupChatHandler = async () => {
    if (!groupName.trim() || groupMembers.length < 1)
      return toast({
        title: 'Fill All The Data!',
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
        `${import.meta.env.VITE_API_URL}/chats/createGroup`,
        {
          name: groupName.trim(),
          users: groupMembers.map((member) => member._id),
        },
        config
      );

      setGroupName('');
      setGroupMembers([]);
      dispatch(chatActions.setSelectedChat({ ...data }));
      onClose();
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

  const addUserToGroupHandler = (user) => {
    const groupMemberIds = groupMembers.map((member) => member._id);
    if (groupMemberIds.includes(user._id)) return;

    setGroupMembers((prevVal) => [...prevVal, user]);
  };

  const removeUserFromGroupHandler = (userId) => {
    setGroupMembers((prevVal) => [
      ...prevVal.filter((member) => member._id !== userId),
    ]);
  };

  return (
    <>
      <Button
        colorScheme="gray"
        leftIcon={<AddIcon />}
        onClick={onOpen}
        style={{ wordWrap: 'break-word' }}
      >
        Create Group Chat
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

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="messenger" onClick={createGroupChatHandler}>
              Create Group Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
