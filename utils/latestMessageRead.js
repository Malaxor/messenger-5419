module.exports = (messages, otherUser) => {
  const readMessages = [];

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const { senderId, receiverHasRead } = message;

    if (senderId === otherUser.id && receiverHasRead) {
      readMessages.push(message);
    }
  }
  return readMessages[readMessages.length - 1].id;
}