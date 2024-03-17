import React from "react";
import iconArrowUp from "../assets/shared/icon-arrow-up.svg"
import iconArrowUpActive from "../assets/shared/icon-arrow-up-active.svg"
import iconComments from "../assets/shared/icon-comments.svg"
import axios from 'axios'

export default function FeedbackCard(props) {

    // states
    const [isActive, setIsActive] = React.useState(false)
    const [upvoteCount, setUpvoteCount] = React.useState(props.upvotes)

    function handleUpvoteClick() {
        if (!isActive) {
            axios.patch(`http://localhost:5000/increment-like/${props.id}`)
                .then(response => {
                    if (response.status === 200) {
                        setUpvoteCount(prev => ++prev)
                        setIsActive(true)
                    }
                })
                .catch(error => {
                    console.error('Error updating vote count:', error);
                });

            axios.patch(`http://localhost:5000/add-to-user-upvotes/${props.id}/65e0c2dae80fa646118fb53d`)
            .catch(error => {
                console.error('Error updating user document:', error);
            });
        } else {
            axios.patch(`http://localhost:5000/decrement-like/${props.id}`)
            .then(response => {
                if (response.status === 200) {
                    setUpvoteCount(prev => prev - 1)
                    setIsActive(false)
                }
            })
            .catch(error => {
                console.error('Error updating vote count:', error);
            });

            axios.patch(`http://localhost:5000/remove-from-user-upvotes/${props.id}/65e0c2dae80fa646118fb53d`)
            .catch(error => {
                console.error('Error updating user document:', error);
            });
        }
    }

    return (
        <section id={`feedback-${props.id}`} className="FeedbackCard container-primary">

            <section className="FeedbackCard__text-content">
                <h3 className="FeedbackCard__title">{props.title}</h3>
                <p className="FeedbackCard__description">{props.description}</p>

                <section className="FeedbackCard__category-container">
                    <p className="FeedbackCard__category">{props.category}</p>
                </section>
            </section>

            <button className={`FeedbackCard__upvote-btn ${isActive && 'FeedbackCard__upvote-btn--active'}`} onClick={handleUpvoteClick}>
                <img src={isActive? iconArrowUpActive : iconArrowUp} />
                <p>{upvoteCount}</p>
            </button>

            <section className='FeedbackCard__comment-count'>
                <img src={iconComments} />
                <p>{props.commentCount}</p>
            </section>
        </section>
    )
}