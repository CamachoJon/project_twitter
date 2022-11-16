// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

contract TwitterContract {

    event AddTweet(address recipient, uint tweetId);
    event DeleteTweet(uint tweetId, bool isDeleted);
    event UpdateTweet(uint tweetId, string updatedText);

    struct Tweet {
        uint id;
        address username;
        string tweetText;
        bool isDeleted;
    }

    Tweet[] private tweets;
    // stores the address wallet of the person using the smart contract
    mapping (uint256 => address) tweetToOwner;


    function addTweet(string memory tweetText, bool isDeleted) external {
        uint tweetId = tweets.length;
        tweets.push(Tweet(tweetId, msg.sender, tweetText, isDeleted));
        tweetToOwner[tweetId] = msg.sender;
        // emit triggers the event in charge of doing the blockchain changes
        emit AddTweet(msg.sender, tweetId);
    }   
    // collects all the tweets together
    function getAllTweets() external view returns (Tweet[] memory){
        // get all tweets from memeory (deleted or not)
        // stores them in an array called temporary, we need to know the length in advance
        Tweet[] memory temporary = new Tweet[](tweets.length);
        uint counter = 0;
        // if the tweets are not delleted it will add it to temporary
        for (uint i = 0; i < tweets.length; i++) {
            if(tweets[i].isDeleted == false){
                temporary[counter] = tweets[i];
                counter++;
            }
        }
        // store in result the tweets that are not deleted
        Tweet[] memory result = new Tweet[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }

        return result;
    }
    // same as getalltweets but also checks if it is owner and not dleted then gets stored in temp
    function getMyTweets() external view returns (Tweet[] memory){

        Tweet[] memory temporary = new Tweet[](tweets.length);
        uint counter = 0;
        for (uint i = 0; i < tweets.length; i++) {
            if(tweetToOwner[i] == msg.sender && tweets[i].isDeleted == false){
                temporary[counter] = tweets[i];
                counter++;
            }
        }
        // now that we know how many tweets fullfill the conditions (ownerr and not deleted), we store them in result 
        Tweet[] memory result = new Tweet[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }

        return result;
    }
    // we are just changing hte flag isDeleted (just a status) from false to true, emit does the change on the blockchain
    function deleteTweet(uint tweetId, bool isDeleted) external{
        if (tweetToOwner[tweetId] == msg.sender) {
            tweets[tweetId].isDeleted = isDeleted;
            emit DeleteTweet(tweetId, isDeleted);
        }
    }

    function updateTweet(uint tweetId, string memory updatedText) external{
        if (tweetToOwner[tweetId] == msg.sender) {
            tweets[tweetId].tweetText = updatedText;
            emit UpdateTweet(tweetId, updatedText);
        }
    }
}