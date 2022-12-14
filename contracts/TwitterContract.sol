// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

contract TwitterContract {
    
    receive() external payable {}

    event AddTweet(address recipient, uint tweetId);
    event DeleteTweet(uint tweetId, bool isDeleted);
    event UpdateTweet(uint tweetId);
    event AddRemoveLikeFromTweet(uint tweetID);
    
    struct Tweet {
        uint id;
        address username;
        string tweetText;
        bool isDeleted;
        string date;
        address[] likedBy;
    }

    Tweet[] private tweets;

    mapping (uint256 => address) tweetToOwner;

    /**
     * @dev a private function to add tweets
     * @param tweetText text to be added in the tweet
     * @param isDeleted a flag to detect the deleted state of the tweet
     * @param date the time that the tweet was created
     */
    function addTweet(string memory tweetText, bool isDeleted, string memory date) external {
        
        uint tweetId = tweets.length;
        address[] memory likedBy;
        tweets.push(Tweet(tweetId, msg.sender, tweetText, isDeleted, date, likedBy));
        tweetToOwner[tweetId] = msg.sender;
        emit AddTweet(msg.sender, tweetId);
    }   
    /**
     * @dev a private function to retrieve all tweets
     * @return result returns an array with all the tweets with a false state in isDeleted
     */
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
    /**
     * @dev a private function to retrieve all the tweets from current users
     * @return result returns an array with all the tweets from the current user with a false state in isDeleted
     */
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
    /**
     * @dev a private function to update the deleted status of a given tweet
     * @param tweetId id of a given tweet
     * @param isDeleted new status for deleted flag (true)
     */
    function deleteTweet(uint tweetId, bool isDeleted) external{
        if (tweetToOwner[tweetId] == msg.sender) {
            tweets[tweetId].isDeleted = isDeleted;
            emit DeleteTweet(tweetId, isDeleted);
        }
    }
    /**
     * @dev a private function to update a given tweet
     * @param updatedText updated text of tweet
     * @param tweetId id of tweet to be updated
     * @param newDate the time that the tweet was updated
     */
    function updateTweet(string memory updatedText, uint tweetId, string memory newDate) external{
        if (tweetToOwner[tweetId] == msg.sender) {
            tweets[tweetId].tweetText = updatedText;
            tweets[tweetId].date = newDate;
            emit UpdateTweet(tweetId);
        }
    }
    /**
     * @dev a private function to add or remove likes from a given tweet
     * @param tweetId id of the given tweet
     */
    function addRemoveLikeFromTweet(uint tweetId) external{
        bool isLikedByUser = false;
        for (uint i = 0; i < tweets[tweetId].likedBy.length; i++) {
            if(msg.sender == tweets[tweetId].likedBy[i]){
                isLikedByUser = true;
                break;
            }
        }
        
        if (isLikedByUser) {
            address[] memory temporary = new address[](tweets[tweetId].likedBy.length - 1);
            uint counter = 0;

            for (uint i = 0; i < tweets[tweetId].likedBy.length; i++) {
                if(tweets[tweetId].likedBy[i] != msg.sender){
                    temporary[counter] = tweets[tweetId].likedBy[i];
                    counter++;
                }
            }
            tweets[tweetId].likedBy = temporary;

        }else{
            tweets[tweetId].likedBy.push(msg.sender);
        }

        emit AddRemoveLikeFromTweet(tweetId);
    }
}