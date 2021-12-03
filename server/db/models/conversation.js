const { Op } = require("sequelize");
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {});

// find conversation given two user Ids
Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id]
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id]
      }
    }
  });
  // return conversation or null if it doesn't exist
  return conversation;
};

// using this static function in two scenarios: 
// 1) return the latest message read by user
// 2) return latest message read by the other user
Conversation.readMessages = function(messages, personId) {
  const readMessages = messages.reduce((arr, message) => {
    const { senderId, receiverHasRead } = message;
    if (senderId === personId && receiverHasRead) {
      arr.push(message);
    }
    return arr;
  }, []);
  return readMessages.length ? readMessages[readMessages.length - 1].id : null;
}
// the user will know the number of unread messages sent by the other user
Conversation.unreadMessages = function(messages, personId) {
  const readMessages = messages.reduce((arr, message) => {
    const { senderId, receiverHasRead } = message;
    if (senderId === personId && !receiverHasRead) {
      arr.push(message);
    }
    return arr;
  }, []);
  return readMessages.length;
}

module.exports = Conversation;
