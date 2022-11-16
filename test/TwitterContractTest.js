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

    // we are creating our invironment before each real test 
    this.beforeEach(async function(){
        // connects to the functions that we want to test        
        // it calls getcontractfactory (from ethers) which retreives the desired contract (twitercontract)
        Twitter = await ethers.getContractFactory("TwitterContract");

        // we are simulating addresses, the method getsigners will do that
        // we are creating an address for the owner and two others
        [owner, addr1] = await ethers.getSigners();

        // simulating the deploy of our code "makes it work"
        twitter = await Twitter.deploy();

        // we are assigning values to the variables
        totalTweets = [];
        totalMyTweets = [];

        // populate the totaltwwets[] (array) with 5 tweets that are not from "owner"
        for (let i = 0; i < NOT_MY_TWEETS_COUNT ; i++) {
            // preparing dummy tweets
            let tweet = {
                'tweetText' : 'Tweet with ID: ' + i,
                'userName' : addr1,
                'isDeleted' : false
            };
            console.log('Tweet from address: addr1 is added')           
            // we simulate the connection with .connect() method and then we use addtweet() to add a tweet
            await twitter.connect(addr1).addTweet(tweet.tweetText, tweet.isDeleted);
            // once the tweet is created we push it to totaltweet
            totalTweets.push(tweet);
        }

        //populate totaltwwet and totalmytweet[]  with three tweets that belongs to the owner
        for (let i = 0; i < MY_TWEETS_COUNT; i++) {
            let tweet = {
                'tweetText' : 'Tweet with ID: ' + (NOT_MY_TWEETS_COUNT + i),
                'userName' : owner,
                'isDeleted' : false
            }   

            await twitter.addTweet(tweet.tweetText, tweet.isDeleted);
            totalTweets.push(tweet);
            totalMyTweets.push(tweet);
            console.log('Tweet from address: owner is added')   
        }
    });

    describe("Add Tweet", function() {
        it("Should emit AddTweet event", async function(){
            let tweet = {
                'tweetText' : 'Just a random text',
                'isDeleted' : false
            };
            // expect retrieves our funtion addTweet() to emit the event addtweet
            await expect(await twitter.addTweet(tweet.tweetText, tweet.isDeleted))
            .to.emit(twitter, 'AddTweet').withArgs(owner.address, NOT_MY_TWEETS_COUNT + MY_TWEETS_COUNT);
            console.log('A tweet was added')
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
                console.log('A tweet was deleted')
        })
    });

    describe("Update tweet", function(){
        
    })
})