import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import './style.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  }
}));

const ChatContent = (props) => {
  const classes = useStyles();
  const spanEl = useRef();

  const { conversation } = props;
  const { latestMessageText, otherUser, messages } = conversation;

  useEffect(() => {
    if (messages.length) {
      const lastMessage = messages[messages.length - 1];
      const { senderId, receiverHasRead } = lastMessage;
  
      if (senderId === otherUser.id && !receiverHasRead) {
        spanEl.current.classList.add('preview-text--black');
      } else {
        spanEl.current.classList.remove('preview-text--black');
      }
    }
  }, [messages, spanEl])

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          <span ref={spanEl} className="">{latestMessageText}</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatContent;
