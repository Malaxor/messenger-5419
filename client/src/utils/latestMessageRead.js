const latestMessageRead = (messages, userId) => {
  const readMessages = [];

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const { senderId, receiverHasRead } = message;

    if (senderId === userId && receiverHasRead) {
      readMessages.push(message);
    }
  }
  return readMessages.length ? readMessages[readMessages.length - 1].id : null;
}

export default latestMessageRead;