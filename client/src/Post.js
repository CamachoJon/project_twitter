import React, { forwardRef } from "react";
import "./Post.css";
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './Avatar';
// import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import PublishIcon from "@material-ui/icons/Publish";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit'
import { Button } from "@material-ui/core";
import "./Feed";

const editTweet = async (e) =>{
  let key = e.target.parentNode.getAttribute('key');

  if (key != null){
  }
}

const Post = forwardRef(
  ({ displayName, text, personal, onClickDelete, onClickEdit }, ref) => {

    return (
      <div className="post" ref={ref}>
        <div className="post__avatar">
          <Avatar
            style={{ width: '100px', height: '100px' }}
            avatarStyle='Circle'
            {...generateRandomAvatarOptions() }
          />
        </div>
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3>
                {displayName}{" "}
              </h3>
            </div>
            <div className="post__headerDescription">
              <p>{text}</p>
            </div>
            <div id="id-edit-tweet" className="hidden">
              <input></input>
              <Button className="tweetBox__tweetButton" onClick={editTweet}>
                Update Tweet
              </Button>
            </div>
          </div>
          <div className="post__footer">
            <ChatBubbleOutlineIcon className="button-behaviour" />
            <RepeatIcon className="button-behaviour" />
            <FavoriteBorderIcon className="button-behaviour"/>
            <PublishIcon className="button-behaviour"/>
            {personal ? (
              <EditIcon onClick={onClickEdit} className="button-behaviour"/>
            ) : ("")}
            {personal ? (
              <DeleteIcon onClick={onClickDelete} className="button-behaviour"/>
            ) : ("")}
          </div>
        </div>
      </div>
    );
  }
);

export default Post;
