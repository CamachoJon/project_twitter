// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

contract TwitterContract {
    
    receive() external payable {}

    event AddTweet(address recipient, uint tweetId);
    event DeleteTweet(uint tweetId, bool isDeleted);
    event UpdateTweet(uint tweetId);
    
    struct Tweet {
        uint id;
        address username;
        string tweetText;
        bool isDeleted;
        string date;
    }

    Tweet[] private tweets;

    mapping (uint256 => address) tweetToOwner;


    function addTweet(string memory tweetText, bool isDeleted, string memory date) external {
        uint tweetId = tweets.length;
        tweets.push(Tweet(tweetId, msg.sender, tweetText, isDeleted, date));
        tweetToOwner[tweetId] = msg.sender;
        emit AddTweet(msg.sender, tweetId);
    }   

    function getAllTweets() external view returns (Tweet[] memory){
        Tweet[] memory temporary = new Tweet[](tweets.length);
        uint counter = 0;

        for (uint i = 0; i < tweets.length; i++) {
            if(tweets[i].isDeleted == false){
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        Tweet[] memory result = new Tweet[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }

        return result;
    }

    function getMyTweets() external view returns (Tweet[] memory){

        Tweet[] memory temporary = new Tweet[](tweets.length);
        uint counter = 0;

        for (uint i = 0; i < tweets.length; i++) {
            if(tweetToOwner[i] == msg.sender && tweets[i].isDeleted == false){
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        Tweet[] memory result = new Tweet[](counter);
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }

        return result;
    }

    function deleteTweet(uint tweetId, bool isDeleted) external{
        if (tweetToOwner[tweetId] == msg.sender) {
            tweets[tweetId].isDeleted = isDeleted;
            emit DeleteTweet(tweetId, isDeleted);
        }
    }

    function updateTweet(string memory updatedText, uint tweetId, string memory newDate) external{
        if (tweetToOwner[tweetId] == msg.sender) {
            tweets[tweetId].tweetText = updatedText;
            tweets[tweetId].date = newDate;
            emit UpdateTweet(tweetId);
        }
    }
}