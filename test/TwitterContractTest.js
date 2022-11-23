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
                'isDeleted' : false,
                'date' :  `0${i}/05/1993`
            };           
            
            await twitter.connect(addr1).addTweet(tweet.tweetText, tweet.isDeleted, tweet.date);
            totalTweets.push(tweet);
        }


        for (let i = 0; i < MY_TWEETS_COUNT; i++) {
            let tweet = {
                'tweetText' : 'Tweet with ID: ' + (NOT_MY_TWEETS_COUNT + i),
                'userName' : owner,
                'isDeleted' : false,
                'date' :  `1${i}/05/1993`
            }   

            await twitter.addTweet(tweet.tweetText, tweet.isDeleted, tweet.date);
            totalTweets.push(tweet);
            totalMyTweets.push(tweet);
        }
    });

    describe("Add Tweet", function() {
        it("Should emit AddTweet event", async function(){
            let tweet = {
                'tweetText' : 'Just a random text',
                'isDeleted' : false,
                'tweetDate' : '07/05/1993'
            };

            await expect(await twitter.addTweet(tweet.tweetText, tweet.isDeleted, tweet.tweetDate))
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
                twitter.connect(addr1).deleteTweet(TWEET_ID, TWEET_DELETED))
                .to.emit(twitter, "DeleteTweet").withArgs(TWEET_ID, TWEET_DELETED);
        })
    });

    describe("Update tweet", function(){
        it("Should emit UpdateTweet event", async function(){
            
            const TWEET_ID = 0;
            const tweetsFromChain = await twitter.connect(addr1).getAllTweets();
            originalText = tweetsFromChain[TWEET_ID].tweetText;
            originalDate = tweetsFromChain[TWEET_ID].date;

            await expect(twitter.connect(addr1).updateTweet('New text for this tweet', TWEET_ID, '19/08/1965'))
            .to.emit(twitter, "UpdateTweet").withArgs(TWEET_ID);
            
            const tweetsFromChainUpdated = await twitter.connect(addr1).getAllTweets();
            newText = tweetsFromChainUpdated[TWEET_ID].tweetText;
            newDate = tweetsFromChainUpdated[TWEET_ID].date;

            expect(originalText).to.not.equal(newText);
            expect(originalDate).to.not.equal(newDate);
        })
    })
})