import { HStack, Text } from '@chakra-ui/react';
import UserModal from './UserModal';
import SearchDrawer from './SearchDrawer';

const Navbar = () => {
  return (
    <HStack
      p="10px 20px"
      minHeight="80px"
      bgColor="rgb(35, 35, 35)"
      justifyContent="space-between"
    >
      <SearchDrawer />

      <Text
        color="rgb(255, 255, 255)"
        fontSize={{ base: '22px', sm: '24px', md: '35px', lg: '40px' }}
      >
        NCHAT
      </Text>

      <UserModal />
    </HStack>
  );
};

export default Navbar;
