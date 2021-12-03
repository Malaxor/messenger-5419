import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { updateMessages } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between"
  }
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user, updateMessages } = props;
  const conversation = props.conversation || {};
  const { messages, otherUser } = conversation;

  useEffect(() => {
    if (messages?.length) {
      const messagesIds = messages.reduce((arr, message) => {
        const { id, senderId, receiverHasRead } = message;
        if (senderId === otherUser.id && !receiverHasRead) arr.push(id);
        return arr;
      }, []);
      if (messagesIds.length) {
        updateMessages(conversation.id, messagesIds);
      }
    }
  }, [updateMessages, messages?.length, conversation, otherUser]);

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              lastReadByOther={conversation.lastReadByOther}
              userId={user.id}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find((conversation) => 
        conversation.otherUser.username === state.activeConversation
      )
  };
};

export default connect(mapStateToProps, { updateMessages })(ActiveChat);
