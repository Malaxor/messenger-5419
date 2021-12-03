const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");


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
      const messages = await Message.findAll({
        where: { conversationId }
      });
      const lastReadByOther = Conversation.readMessages(messages, senderId);
      const lastReadByUser = Conversation.readMessages(messages, recipientId);
      const unread = Conversation.unreadMessages(messages, recipientId);
      return res.json({ message, sender, lastReadByUser, lastReadByOther, unread });
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

    res.json({ message, sender });
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
    const { convoId, messagesIds } = req.body;

    await Message.update({ receiverHasRead: true }, {
      where: {
        conversationId: convoId,
        id: messagesIds
      }
    });

    let lastReadByOther = await Message.findAll({
      where: {
        senderId: userId,
        conversationId: convoId, 
        receiverHasRead: true
      },
      attributes: ['id']
    });
    if (lastReadByOther.length) {
      lastReadByOther = lastReadByOther[lastReadByOther.length - 1].id;
    }

    const lastReadByUser = messagesIds[messagesIds.length - 1];
    const unread = 0;
    
    res.json({ lastReadByUser, lastReadByOther, unread, messagesIds });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
