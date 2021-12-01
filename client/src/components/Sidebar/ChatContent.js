import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
  },
  black: {
    color: 'black',
    fontWeight: 700,
  }
}));

const ChatContent = (props) => {
  const classes = useStyles();
  const typeographyEl = useRef();

  const { conversation } = props;
  const { latestMessageText, otherUser, messages } = conversation;

  useEffect(() => {
    if (messages.length) {
      const lastMessage = messages[messages.length - 1];
      const { senderId, receiverHasRead } = lastMessage;
  
      if (senderId === otherUser.id && !receiverHasRead) {
        typeographyEl.current.classList.add(classes.black);
      } else {
        typeographyEl.current.classList.remove(classes.black);
      }
    }
  }, [messages, typeographyEl, otherUser, classes]);

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography ref={typeographyEl} className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatContent;
