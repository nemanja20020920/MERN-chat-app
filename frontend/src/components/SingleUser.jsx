import { Avatar, Box, Text } from '@chakra-ui/react';

const SingleUser = ({ user, onClick }) => {
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
      onClick={onClick}
    >
      <Avatar size="sm" src={user?.pic} />
      <Text>{user?.fullName}</Text>
    </Box>
  );
};

export default SingleUser;
