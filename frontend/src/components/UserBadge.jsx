import { SmallCloseIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/react';

const UserBadge = ({ user, onUserRemove }) => {
  return (
    <Box
      p={2}
      bgColor="rgb(0, 106, 255)"
      width="fit-content"
      my={1}
      me={1}
      borderRadius={50}
      color="rgba(255, 255, 255)"
      display="inline-block"
    >
      <Text display="inline" me={2}>
        {user.fullName}
      </Text>
      <SmallCloseIcon onClick={onUserRemove} _hover={{ cursor: 'pointer' }} />
    </Box>
  );
};

export default UserBadge;
