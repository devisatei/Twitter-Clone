import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.delete) {
        handleDeleteTweetClick(e.target.dataset.delete)
    }
    else if(e.target.dataset.myreplybtn){
        handleMyReplyClick(e.target.dataset.myreplybtn)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `code.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

//this is to delete a tweet the user tweeted
function handleDeleteTweetClick(tweetId){
    //narrowing tweet id
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweetId === tweet.uuid
    })[0]

    if(targetTweetObj.handle === '@Scrimba'){
        const findIndex = tweetsData.findIndex(function(tweet){
            return tweet.uuid === targetTweetObj.uuid
        })
        tweetsData.splice(findIndex, 1)
        render()
    }
}

function handleMyReplyClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    let replyInputId = "reply-input-" + targetTweetObj.uuid

    const replyInput = document.getElementById(replyInputId)

    if(replyInput.value){
        targetTweetObj.replies.unshift(
            {
                handle: "@Scrimba",
                profilePic: "images/drazen.drinic.jpg",
                tweetText: replyInput.value,
            }
        )
    }
    render()
    replyInput.value = ''
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){

        //creating reply input and btn
        let repliesHtml = ''

        repliesHtml = 
        `
        <div class="">
            <textarea id="reply-input-${tweet.uuid}" class="reply-input" placeholder="Add a reply" ></textarea>
            <button id="reply-btn-${tweet.uuid}" class="reply-btn" data-myreplybtn="${tweet.uuid}">Reply</button>
        </div>
        `
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        //shows delete button for user's tweet
        let myTweetDeleteBtnClass = ''
        if(tweet.handle != '@Scrimba') {
            myTweetDeleteBtnClass = 'hidden'
        }

        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                let myReplyDeleteBtnClass = ''

                if(reply.handle != '@Scrimba'){
                    myReplyDeleteBtnClass = 'hidden'
                }

                repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <i class="close-btn fa-solid fa-trash ${myReplyDeleteBtnClass}" data-myreplytweetid="${tweet.uuid}" data-myreplyid="${reply.uuid}"></i>
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                    `
            })
        }

        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                <i class="close-btn fa-solid fa-trash ${myTweetDeleteBtnClass}" data-delete="${tweet.uuid}"></i>

                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}"
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>   
        </div>
        `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

