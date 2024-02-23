import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userActions } from '../store/user';

const UserModal = () => {
  //Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //State
  const userData = useSelector((state) => state.user);

  //Functions
  const logoutHandler = () => {
    localStorage.clear('userData');
    dispatch(userActions.logout());
    navigate('/');
    onClose();
  };

  return (
    <>
      <Button colorScheme="transparent" onClick={onOpen}>
        <Avatar size="sm" />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Current User:</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Text fontSize={25}>{userData.fullName}</Text>
              <Avatar src={userData.pic} size="xxl" />
              <Text fontSize={25}>{userData.email}</Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={logoutHandler}>
              Log Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserModal;
