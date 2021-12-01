const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

function lastRecipientRead(messages, userId) {
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
function unreadMessages(messages, otherUserId) {
  const unreadMessages = [];

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const { senderId, receiverHasRead } = message;

    if (senderId === otherUserId && !receiverHasRead) {
      unreadMessages.push(message);
    }
  }
  return unreadMessages.length;
}

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );
    
    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });

    const messages = await Message.findAll({
      where: { 
        conversationId: conversation.id
      }
    });
    const lastRead = lastRecipientRead(messages, senderId);
    const unread = unreadMessages(messages, recipientId);

    res.json({ message, sender, lastRead, unread });
  } catch (error) {
    next(error);
  }
});

// update message status
router.patch('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const { convoId, messagesIds, otherUserId } = req.body;

    await Message.update({ receiverHasRead: true }, {
      where: {
        conversationId: convoId,
        id: messagesIds
      }
    });
    const messages = await Message.findAll({
      where: { 
        conversationId: convoId
      }
    });
    const lastRead = lastRecipientRead(messages, userId);
    const unread = unreadMessages(messages, otherUserId);

    res.json({ lastRead, unread, messagesIds });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
