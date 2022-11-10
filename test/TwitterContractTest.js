const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Twitter Contract", function() {
    let Twitter;
    let twitter;
    let owner;

    const NOT_MY_TWEETS_COUNT = 5;
    const MY_TWEETS_COUNT = 3;

    let totalTweets;
    let totalMyTweets;

    this.beforeEach(async function(){
        Twitter = await ethers.getContractFactory("TwitterContract");
        [owner, addr1, addr2] = await ethers.getSigners();
        twitter = await Twitter.deploy();

        totalTweets = [];
        totalMyTweets = [];

        for (let i = 0; i < NOT_MY_TWEETS_COUNT ; i++) {
            let tweet = {
                'tweetText' : 'Tweet with ID: ' + i,
                'userName' : addr1,
                'isDeleted' : false
            };           
            
            await twitter.connect(addr1).addTweet(tweet.tweetText, tweet.isDeleted);
            totalTweets.push(tweet);
        }


        for (let i = 0; i < MY_TWEETS_COUNT; i++) {
            let tweet = {
                'tweetText' : 'Tweet with ID: ' + (NOT_MY_TWEETS_COUNT + i),
                'userName' : owner,
                'isDeleted' : false
            }   

            await twitter.addTweet(tweet.tweetText, tweet.isDeleted);
            totalTweets.push(tweet);
            totalMyTweets.push(tweet);
        }
    });

    describe("Add Tweet", function() {
        it("Should emit AddTweet event", async function(){
            let tweet = {
                'tweetText' : 'Just a random text',
                'isDeleted' : false
            };

            await expect(await twitter.addTweet(tweet.tweetText, tweet.isDeleted))
            .to.emit(twitter, 'AddTweet').withArgs(owner.address, NOT_MY_TWEETS_COUNT + MY_TWEETS_COUNT);
        })
    });

    describe("Get tweets", function() {
        it("Should return the count of total tweets", async function(){
            const tweetsFromChain = await twitter.getAllTweets();
            expect(tweetsFromChain.length).to.equal(MY_TWEETS_COUNT + NOT_MY_TWEETS_COUNT)
        })

        it("Should return the count of all my tweets", async function(){
            const myTweetsFromChain = await twitter.getMyTweets();
            expect(myTweetsFromChain.length).to.equal(MY_TWEETS_COUNT);
        })
    });

    describe("Delete tweet", function(){
        it("Should emit DeleteTweet event", async function(){
            const TWEET_ID = 0;
            const TWEET_DELETED = true;

            await expect(
                twitter.connect(addr1).deleteTweet(TWEET_ID, TWEET_DELETED)
                ).to.emit(twitter, "DeleteTweet").withArgs(TWEET_ID, TWEET_DELETED);
        })
    })
})