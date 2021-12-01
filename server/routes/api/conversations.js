const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId
        }
      },
      attributes: ["id"],
      order: [[ Message, "createdAt", "ASC" ]],
      include: [
        { model: Message },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            }
          },
          attributes: ["id", "username", "photoUrl"],
          required: false
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            }
          },
          attributes: ["id", "username", "photoUrl"],
          required: false
        }
      ]
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }
      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }
      // set properties for notification count and latest message preview
      // will use the latest message time to order the conversations chronologically (latest atop of the stack)
      const { messages, otherUser } = convoJSON;
      const { text, createdAt } = messages[messages.length - 1];
      convoJSON.latestMessageText = text;
      convoJSON.latestMessageTime = new Date(createdAt).getTime();
      // recipient's avatar will display underneath the user's most recent message that was
      // read by the cecipient (getting the id of that message)
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
      convoJSON.lastRecipientRead = lastRecipientRead(messages, userId);
      
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
      // the number of unread messages sent by the other user will display in the chat component
      convoJSON.unreadMessages = unreadMessages(messages, otherUser.id);
      conversations[i] = convoJSON;
    }
    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
