import { Avatar, Tooltip } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { isLastMessage, isSameUser, messageMargin } from '../utils/chat';

const SingleMessage = ({ messages, message, index }) => {
  //Store
  const userData = useSelector((state) => state.user);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent:
          message.sender._id === userData._id ? 'flex-end' : 'flex-start',
        marginTop: '3px',
        marginBottom: '3px',
      }}
    >
      {message.sender._id !== userData._id &&
        isLastMessage(messages, message, index, userData) && (
          <Tooltip
            label={message.sender.fullName}
            placement="bottom-start"
            hasArrow
          >
            <Avatar
              me={1}
              size="sm"
              cursor="pointer"
              name={message.sender.fullName}
              src={message.sender.pic}
              mt={messageMargin(messages, message, index)}
            />
          </Tooltip>
        )}
      <span
        style={{
          maxWidth: '75%',
          backgroundColor:
            message.sender._id === userData._id
              ? 'rgb(0, 178, 255)'
              : 'rgb(0, 106, 255)',
          color:
            message.sender._id === userData._id
              ? 'rgb(0, 0, 0)'
              : 'rgb(255, 255, 255)',
          padding: '5px 15px',
          borderRadius: '20px',
          marginTop: messageMargin(messages, message, index),
          marginLeft: isSameUser(messages, message, index),
        }}
      >
        {message.content}
      </span>
    </div>
  );
};

export default SingleMessage;
