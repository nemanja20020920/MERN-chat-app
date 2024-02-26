export const getChatName = (chat, userId) => {
  if (chat.isGroupChat) return chat.name;

  const sender = chat.users.find((user) => user._id !== userId);

  return sender.fullName;
};

export const isLastMessage = (messages, message, index, user) => {
  if (
    user._id !== message.sender._id &&
    (!messages[index + 1] ||
      messages[index + 1].sender._id !== message.sender._id)
  )
    return true;
  return false;
};

export const isSameUser = (messages, message, index) => {
  if (
    messages[index + 1] &&
    message.sender._id === messages[index + 1].sender._id
  )
    return '35px';
  return 'initial';
};

export const messageMargin = (messages, message, index) => {
  if (
    messages[index - 1] &&
    messages[index - 1].sender._id !== message.sender._id
  )
    return '10px';
  return 'initial';
};
