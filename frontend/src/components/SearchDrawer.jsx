import { SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Skeleton,
  Stack,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import SingleUser from './SingleUser';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../config';
import { chatActions } from '../store/chat';

const SearchDrawer = () => {
  //State
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  //Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const toast = useToast();
  const dispatch = useDispatch();
  //Store
  const userData = useSelector((state) => state.user);

  //Functions
  const searchHandler = async (query) => {
    try {
      setIsLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_URL}/users?search=${query.trim()}`,
        config
      );

      setUsers([...data]);
    } catch (error) {
      toast({
        title: 'An Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const accessChatHandler = async (userId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`,
        },
      };

      const { data } = await axios.post(
        `${API_URL}/chats`,
        {
          userId,
        },
        config
      );

      console.log(data);
      dispatch(chatActions.setSelectedChat({ ...data }));
      onClose();
    } catch (error) {
      toast({
        title: 'An Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
    }
  };

  return (
    <>
      <Button ref={btnRef} colorScheme="gray" onClick={onOpen}>
        <SearchIcon />
        <Text display={{ base: 'none', md: 'inline' }} ml={2}>
          Search Users
        </Text>
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search users to chat</DrawerHeader>

          <DrawerBody>
            <Input
              placeholder="Search here..."
              onChange={(e) => searchHandler(e.target.value)}
            />
            <VStack>
              {users.length > 0 &&
                users.map((user) => (
                  <SingleUser
                    key={user._id}
                    user={user}
                    onClick={() => accessChatHandler(user._id)}
                  />
                ))}
              {isLoading && (
                <Stack width="100%" overflow-y="scroll">
                  {[...Array(18)].map((x, index) => (
                    <Skeleton key={index} my="5px" height="25px" />
                  ))}
                </Stack>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SearchDrawer;
