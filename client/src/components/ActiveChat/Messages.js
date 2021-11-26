import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 20
  }  
}));

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {messages.map((message) => {
        console.log(message)
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble 
            key={message.id} 
            text={message.text} 
            time={time} 
            otherUser={otherUser}
            receiverHasRead={message.receiverHasRead} 
          />
        ) : (
          <OtherUserBubble 
            key={message.id} 
            text={message.text} 
            time={time} 
            otherUser={otherUser} 
          />
        );
      })}
    </Box>
  );
};

export default Messages;
