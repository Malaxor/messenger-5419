export const addMessageToStore = (state, payload) => {
  const { message, sender, lastRead, unread } = payload;
  console.log(message)
  console.log(lastRead)
  console.log(unread)
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      latestMessageText: message.text,
      latestMessageTime: new Date(message.createdAt).getTime()
    };
    newConvo.lastRecipientRead = lastRead;
    newConvo.unreadMessages = unread;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages = [...convo.messages, message];
      convoCopy.latestMessageText = message.text;
      convoCopy.latestMessageTime = new Date(message.createdAt).getTime();
      convoCopy.lastRecipientRead = lastRead;
      convoCopy.unreadMessages = unread;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, payload) => {
  const { recipientId, message, lastRead, unread } = payload;
  
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages = [...convo.messages, message];
      convoCopy.latestMessageText = message.text;
      convoCopy.latestMessageTime = new Date(message.createdAt).getTime();
      convoCopy.lastRecipientRead = lastRead;
      convoCopy.unreadMessages = unread;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const updateMessagesInStore = (state, payload) => {
  const { convoID, messagesIDs, data } = payload;
  const { lastRead, unread } = data;

  return state.map((convo) => {
    if (convo.id === convoID) {
      const convoCopy = { ...convo };

      convoCopy.messages = convoCopy.messages.map(message => {
        if (messagesIDs.includes(message.id)) {
          const messageCopy = { ...message };
          messageCopy.receiverHasRead = true;
          return messageCopy;
        }
        return message;
      });
      convoCopy.unreadMessages = unread;
      convoCopy.lastRecipientRead = lastRead;
      return convoCopy;
    } else {
      return convo;
    }
  });
};