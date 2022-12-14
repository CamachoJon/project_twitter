import React, { useState, useEffect, forwardRef } from "react";
import TweetBox from "./TweetBox";
import "./Feed.css";
import FlipMove from "react-flip-move";
import { TwitterContractAddress } from './config.js';
import {ethers} from 'ethers';
import Twitter from './utils/TwitterContract.json';
import "./Post.css";
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './Avatar';
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit'
import { Button } from "@material-ui/core";


function Feed(){
    const [posts, setPosts] = useState([]);
  
    /**
     * @dev Retrieves a sorted array of all the existing tweets which are not deleted 
     * @param {*} allTweets array with all the non-deleted tweets 
     * @param {*} address wallet address of the current user 
     * @returns returns a sorted array with the updated tweets (from newest to oldest) 
     */
    const getUpdatedTweets = (allTweets, address) => {

      let updatedTweets = [];
      // Here we set a personal flag around the tweets
      for(let i = 0; i < allTweets.length; i++) {
        if(allTweets[i].username.toLowerCase() === address.toLowerCase()) {
          let tweet = {
            'id': allTweets[i].id,
            'tweetText': allTweets[i].tweetText,
            'isDeleted': allTweets[i].isDeleted,
            'username': allTweets[i].username,
            'personal': true,
            'date' : allTweets[i].date,
            'likedBy' : allTweets[i].likedBy
          };
          updatedTweets.push(tweet);
        } else {
          let tweet = {
            'id': allTweets[i].id,
            'tweetText': allTweets[i].tweetText,
            'isDeleted': allTweets[i].isDeleted,
            'username': allTweets[i].username,
            'personal': false,
            'date' : allTweets[i].date,
            'likedBy' : allTweets[i].likedBy
          };
          updatedTweets.push(tweet);  
        }
      }
      
      updatedTweets = updatedTweets.sort((a, b) => a.date < b.date ? 1 : -1)
      return updatedTweets;
    }
  
    useEffect(() => {
      /**
       * @dev Validates connection to metamask wallet and retrieves all the not-deleted tweets 
       */
      const getAllTweets = async() => {
        try {
          const {ethereum} = window
    
          if(ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const TwitterContract = new ethers.Contract(
              TwitterContractAddress,
              Twitter.abi,
              signer
            )
    
            let allTweets = await TwitterContract.getAllTweets();
            setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
          } else {
            console.log("Ethereum object doesn't exist");
          }
        } catch(error) {
          console.log(error);
        }
      }
      getAllTweets();
    }, []);

    /**
     * @return HTML with elements used in a post
     */
    const Post = forwardRef(
      ({ displayName, text, personal, onClickDelete, onClickEdit, date, likedBy, onClickLike }, ref) => {

        let classForLikeButton = likedBy.length > 0 ? "liked_tweet" : "button-behaviour";

        return (
          <div className="post" ref={ref}>
            <div className="post__avatar">
              <Avatar
                style={{ width: '80px', height: '80px' }}
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
                <div className="post_date">
                  <p>{date}</p>
                </div>
                <div id="id-edit-tweet" className="hidden">
                  <form className="edit_tweet_form">
                  <input onChange={(e) => {
                  }} type="text" placeholder="Changed your mind?" className="editBox"></input>
                  <Button className="tweetBox__tweetButton" onClick={editTweet}>
                    Update Tweet
                  </Button>
                  </form>
                </div>
              </div>
              <div className="post__footer">
                <div className="likes">
                <FavoriteBorderIcon onClick={onClickLike} className={classForLikeButton}/>
                <p className={classForLikeButton}>{likedBy.length}</p>
                </div>
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
  
    /**
     * @dev validates the user's wallet and updates the isDeleted flag of the given tweet to true
     * @param {*} key wallet address of current user 
     * 
     */
    const deleteTweet = key => async() => {

      try {
        const {ethereum} = window
  
        if(ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const TwitterContract = new ethers.Contract(
            TwitterContractAddress,
            Twitter.abi,
            signer
          );
  
          let deleteTweetTx = await TwitterContract.deleteTweet(key, true);
          let allTweets = await TwitterContract.getAllTweets();
          setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
          window.location.reload();
        } else {
          console.log("Ethereum object doesn't exist");
        }
  
      } catch(error) {
        console.log("There was an error");
        console.log(error);
      }
    }

    /**
     * @dev shows or hides the edit tweet element
     * @param {*} key  wallet address of the current user 
     */
    const displayUpdate = key => async(e) => {
      e.preventDefault();
      let inputElement = e.target.parentElement.parentElement.parentElement.childNodes[0].childNodes[3];
      if (inputElement.className === "hidden") {
        inputElement.className = "visible";
        inputElement.childNodes[0].childNodes[1].setAttribute('key', key);
      }else{
        inputElement.className = "hidden"
      }
    }
    /**
     *@dev validates user's address and updates the text of the given tweet 
     * @param e is the wallet address of the user 
     */
    const editTweet = async(e) =>{
      let key = e.target.parentNode.getAttribute('key');
      let newText = e.target.parentElement.parentElement.childNodes[0].value;
      let newDate = getFulllDate(new Date());
    
      if (key != null){
        try {
          const {ethereum} = window
    
          if(ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const TwitterContract = new ethers.Contract(
              TwitterContractAddress,
              Twitter.abi,
              signer
            );
    
            let editTweet = await TwitterContract.updateTweet(newText, key, newDate)
            let allTweets = await TwitterContract.getAllTweets();
            setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
            window.location.reload();
          } else {
            console.log("Ethereum object doesn't exist");
          }
    
        } catch(error) {
          console.log("There was an error");
          console.log(error);
        }
      }

    }

    /**
     * @dev alidates user's address and adds or removes the like from the given tweet 
     * @param {*} key walllet address of the users
     */
    const addRemoveLike = key => async(e) => {
      try {
        const {ethereum} = window
  
        if(ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const TwitterContract = new ethers.Contract(
            TwitterContractAddress,
            Twitter.abi,
            signer
          );
  
          let addRemoveLike = await TwitterContract.addRemoveLikeFromTweet(key)
          let allTweets = await TwitterContract.getAllTweets();
          setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
          window.location.reload();
        } else {
          console.log("Ethereum object doesn't exist");
        }
  
      } catch(error) {
        console.log("There was an error");
        console.log(error);
      }

    }

    /**
     * @dev changes the format to "DD/MM/YYYY 00:00 AM/PM"
     * @param {*} date timestamp
     * @returns returns the date of the tweet with the new format 
     */
    const getFulllDate = (date) => {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
    };

  
    return (
      <div className="feed">
        <div className="feed__header">
          <h2>Home</h2>
        </div>
        <TweetBox />
        <FlipMove id="visible_tweets">
          {posts.map((post) => (
            <Post
              key={post.id}
              displayName={post.username}
              text={post.tweetText}
              personal={post.personal}
              onClickEdit={displayUpdate(post.id)}
              onClickDelete={deleteTweet(post.id)}
              date = {post.date}
              likedBy = {post.likedBy}
              onClickLike = {addRemoveLike(post.id)}
            />
          ))}
        </FlipMove>
        
      </div>
    );

}

export default Feed;