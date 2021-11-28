module.exports = (messages, otherUser) => {
  const unreadMessages = [];

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const { senderId, receiverHasRead } = message;

    if (senderId === otherUser.id && !receiverHasRead) {
      unreadMessages.push(message);
    }
  }
  return unreadMessages.length;
}