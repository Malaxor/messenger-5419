import {
  addNewConvoToStore,
  addOnlineUserToStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
  updateMessageInStore
} from "./utils/reducerFunctions";
import store from "./index";

// ACTIONS

const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";
const UPDATE_MESSAGE_STATUS = "UPDATE_MESSAGE_STATUS";

// ACTION CREATORS

export const gotConversations = (conversations) => {
  return {
    type: GET_CONVERSATIONS,
    conversations,
  };
};

export const setNewMessage = (message, sender) => {
  const { id: userId } = store.getState().user;
  
  return {
    type: SET_MESSAGE,
    payload: { message, userId, sender: sender || null },
  };
};
export const updateMessageStatus = (convoId, messageId) => {
  return {
    type: UPDATE_MESSAGE_STATUS,
    payload: { convoId, messageId }
  };
};

export const addOnlineUser = (id) => {
  return {
    type: ADD_ONLINE_USER,
    id,
  };
};

export const removeOfflineUser = (id) => {
  return {
    type: REMOVE_OFFLINE_USER,
    id,
  };
};

export const setSearchedUsers = (users) => {
  return {
    type: SET_SEARCHED_USERS,
    users,
  };
};

export const clearSearchedUsers = () => {
  return {
    type: CLEAR_SEARCHED_USERS,
  };
};

// add new conversation when sending a new message
export const addConversation = (recipientId, newMessage) => {
  const { id: userId } = store.getState().user;
  
  return {
    type: ADD_CONVERSATION,
    payload: { recipientId, newMessage, userId },
  };
};

// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return [...state, ...action.conversations];
    case SET_MESSAGE:
      return addMessageToStore(state, action.payload);
    case UPDATE_MESSAGE_STATUS:
      return updateMessageInStore(state, action.payload);
    case ADD_ONLINE_USER: {
      return addOnlineUserToStore(state, action.id);
    }
    case REMOVE_OFFLINE_USER: {
      return removeOfflineUserFromStore(state, action.id);
    }
    case SET_SEARCHED_USERS:
      return addSearchedUsersToStore(state, action.users);
    case CLEAR_SEARCHED_USERS:
      return state.filter((convo) => convo.id);
    case ADD_CONVERSATION:
      return addNewConvoToStore(
        state,
        action.payload.recipientId,
        action.payload.newMessage,
        action.payload.userId
      );
    default:
      return state;
  }
};

export default reducer;
