import React, { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from "react-redux";
import FeedbackCard from "../components/FeedbackCard"
import iconArrowLeft from "../assets/shared/icon-arrow-left.svg"

export default function() {
    // States
    const currentUser = useSelector(state => state.appState.currentUser)
    const [feedbackData, setFeedbackData] = useState({})
    const [commentCount, setCommentCount] = useState(0)
    const [replyFormId, setReplyFormId] = useState(null)
    const [comment, setComment] = useState('')
    const [lengthRemaining, setLengthRemaining] = useState(250)
    const [replyToComment, setReplyToComment] = useState('')

    // Grab ID from URL
    const { feedbackId } = useParams()

    // Get initial feedback data
    useEffect(() => {
        getDataOfCurrentFeedback()
    }, [])

    // Update the total comment+reply counter
    useEffect(() => {
        setCommentCount(feedbackData.comments
        ? feedbackData.comments.reduce((total, comment) => {
            // Count the comment itself
            total += 1
            // Add the replies count
            if (comment.replies && Array.isArray(comment.replies)) {
                total += comment.replies.length
            }
            return total
        }, 0)
        : 0)
    }, [feedbackData])
    
    // Function to get data of the current feedback
    function getDataOfCurrentFeedback() {
        axios.get(`http://localhost:5000/get-single-feedback/${feedbackId}`)
        .then(response => {
            setFeedbackData(response.data)
        })
        .catch(error => {
            console.error('Error fetching data:', error)
        });
    }

    // Toggle visibility of the reply form corresponding to the clicked comment
    function toggleReplyForm(commentId) {
        if (replyFormId === commentId) {
            setReplyFormId(null) // Close the form if it's already open
        } else {
            setReplyFormId(commentId) // Open the reply form for this comment
        }
    }

    // Handle comment form input change
    function handleInputChange(e) {
        setComment(e.target.value)
        setLengthRemaining(250 - e.target.value.length)
    }

    // Add comment to the feedback
    function addCommentToFeedback() {
        if (comment) {
            axios.post(`http://localhost:5000/add-comment-to-feedback/${feedbackId}`, {
                // We send the data already as an object to be added to the comments array in database
                commentData : {
                    content: comment,
                    user: {
                        image: currentUser.currentUserImage,
                        name: currentUser.currentUserName,
                        username: currentUser.currentUserUsername 
                    }
                }
            })
            .then(response => {
                getDataOfCurrentFeedback()
                setComment('')
            })
            .catch(error => {
                console.log(error)
            });
        }
    } 

    // Add a reply to a comment
    function handleReplyToComment(commentId, replyingTo) {
        if (replyToComment) {
            axios.post(`http://localhost:5000/add-reply-to-comment/${feedbackId}/${commentId}`, {
                // We send the data already as an object to be added to the comments array in database
                replyData : {
                    content: replyToComment,
                    replyingTo: replyingTo,
                    user: {
                        image: currentUser.currentUserImage,
                        name: currentUser.currentUserName,
                        username: currentUser.currentUserUsername 
                    }
                }
            })
            .then(response => {
                getDataOfCurrentFeedback()
                setReplyToComment('')
                setReplyFormId(null)
            })
            .catch(error => {
                console.log(error)
            });
        }
    }

    return(
        <main className="FeedbackPage">
            <section className="head">
                <Link className="head__go-back" to={`..`}>
                    <img src={iconArrowLeft} alt="" />
                    Go Back
                </Link>

                <Link className="head__to-edit" to={`/editFeedback/:${feedbackId}`}>
                    Edit Feedback
                </Link>
            </section>

            <FeedbackCard
                id={feedbackId}
                title={feedbackData.title}
                description={feedbackData.description}
                category={feedbackData.category}
                upvotes={feedbackData.upvotes}
                commentCount={commentCount}
            />

            <section className="comment-section container-primary">
                <p className="comment-section__comment-count">{commentCount} Comments</p>

                {feedbackData.comments && feedbackData.comments.map((comment, index) => (
                    <section className="comment-card" id={"comment-card-" + comment.id} key={index}>
                        {/* Main Comment card */}
                        <section className="comment-card__top">
                            <img className="comment-card__image" src={comment.user.image} alt="User profile picture" />

                            <section className="comment-card__name-and-email">
                                <p className="comment-card__name">{comment.user.name}</p>
                                <p className="comment-card__email">@{comment.user.username}</p>
                            </section>

                            <button className="comment-card__reply-button" onClick={() => toggleReplyForm(comment.id)}>Reply</button>
                        </section>

                        <p className="comment-card__content">{comment.content}</p>

                        {/* Reply to a comment */}
                        <section
                            className="form-reply-to-comment"
                            id={`form-reply-to-comment-${comment.id}`}
                            style={{ display: replyFormId === comment.id ? 'block' : 'none' }}
                        >
                            <textarea 
                                placeholder="Type your reply here" 
                                maxLength="250" 
                                rows={4} 
                                value={replyToComment} 
                                onChange={(e) => setReplyToComment(e.target.value)}
                            />
                            <button className="button-primary" onClick={() => handleReplyToComment(comment.id, comment.user.username)}>Post Reply</button>
                        </section>

                        {/* Display replies if they exist */}
                        {comment.replies && comment.replies.length > 0 && (
                            <section className="comment-reply__container">
                                {comment.replies && comment.replies.map((reply, index) => (
                                    <section className="comment-reply" key={index}>
                                        <section className="comment-card__top">
                                            <img className="comment-card__image" src={reply.user.image} alt="" />

                                            <section className="comment-card__name-and-email">
                                                <p className="comment-card__name">{reply.user.name}</p>
                                                <p className="comment-card__email">@{reply.user.username}</p>
                                            </section>

                                            <button className="comment-card__reply-button">Reply</button>
                                        </section>

                                        <p className="comment-card__content">
                                            <span className="reply-username">@{reply.replyingTo} </span>
                                            {reply.content}
                                        </p>
                                    </section>
                                ))}
                            </section>
                        )}
                    </section>
                ))}
            </section>

            {/* Add comment */}
            <section className="add-comment container-primary">
                <h3 className="add-comment__title">Add comment</h3>
                
                <textarea 
                    placeholder="Type your comment here" 
                    maxLength="250" 
                    rows={4} 
                    value={comment}
                    onChange={e => handleInputChange(e)}
                />

                <section className="add-comment__bottom">
                    <p className="add-comment__letters-countdown">{lengthRemaining} Characters left</p>
                    <button className="button-primary" onClick={addCommentToFeedback}>Post Comment</button>
                </section>
            </section>
        </main>
    )
}