import React, { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import FeedbackCard from "../components/FeedbackCard"
import iconArrowLeft from "../assets/shared/icon-arrow-left.svg"

export default function() {
    // States
    const [feedbackData, setFeedbackData] = useState({})

    // Grab ID from URL
    const { feedbackId } = useParams()

    // Get data of current feedback
    useEffect(() => {
        axios.get(`http://localhost:5000/get-single-feedback/${feedbackId}`)
            .then(response => {
                setFeedbackData(response.data)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [])

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
                commentCount={feedbackData.comments ? feedbackData.comments.length : 0}
            />

            <section className="comment-section container-primary">
                <p className="comment-section__comment-count">{feedbackData.comments ? feedbackData.comments.length : 0} Comments</p>

                {feedbackData.comments && feedbackData.comments.map((comment, index) => (
                    <section className="comment-card" key={index}>
                        {/* Main Comment card */}
                        <section className="comment-card__top">
                            <img className="comment-card__image" src={comment.user.image} alt="User profile picture" />

                            <section className="comment-card__name-and-email">
                                <p className="comment-card__name">{comment.user.name}</p>
                                <p className="comment-card__email">@{comment.user.username}</p>
                            </section>

                            <button className="comment-card__reply-button">Reply</button>
                        </section>                                                                                                                                                          

                        <p className="comment-card__content">{comment.content}</p>

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
                
                <input className="add-comment__textarea" type="textarea" placeholder="Type your comment here" />

                <p className="add-comment__letters-countdown"></p>

                <button className="button-primary">Post Comment</button>
            </section>
        </main>
    )
}