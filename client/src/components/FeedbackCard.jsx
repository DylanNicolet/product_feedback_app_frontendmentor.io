import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import iconArrowUp from "../assets/shared/icon-arrow-up.svg";
import iconArrowUpActive from "../assets/shared/icon-arrow-up-active.svg";
import iconComments from "../assets/shared/icon-comments.svg";
import axios from "axios";

export default function FeedbackCard(props) {
// States
const [isActive, setIsActive] = useState(false);
const [upvoteCount, setUpvoteCount] = useState(props.upvotes);

// Update upvoteCount when props.upvotes changes
useEffect(() => {
    setUpvoteCount(props.upvotes);
}, [props.upvotes]);

function handleUpvoteClick(e) {
    e.preventDefault();
    const id = props.id;

    if (!isActive) {
        axios
            .patch(`http://localhost:5000/increment-like/${id}`)
            .then((response) => {
            if (response.status === 200) {
                setUpvoteCount((prev) => ++prev);
                setIsActive(true);
            }
            })
            .catch((error) => {
            console.error("Error updating vote count:", error);
            });

        axios
            .patch(
            `http://localhost:5000/add-to-user-upvotes/${id}/65e0c2dae80fa646118fb53d`
            )
            .catch((error) => {
            console.error("Error updating user document:", error);
            });
    } else {
        axios
            .patch(`http://localhost:5000/decrement-like/${id}`)
            .then((response) => {
            if (response.status === 200) {
                setUpvoteCount((prev) => prev - 1);
                setIsActive(false);
            }
            })
            .catch((error) => {
            console.error("Error updating vote count:", error);
            });

        axios
            .patch(
            `http://localhost:5000/remove-from-user-upvotes/${id}/65e0c2dae80fa646118fb53d`
            )
            .catch((error) => {
            console.error("Error updating user document:", error);
            });
    }
}

return (
    <section id={`feedback-${props.id}`} className="FeedbackCard container-primary">
        <Link to={`/feedback/${props.id}`}>
            <section className="FeedbackCard__text-content">
                <h3 className="FeedbackCard__title">{props.title}</h3>
                <p className="FeedbackCard__description">{props.description}</p>

                <section className="FeedbackCard__category-container">
                <p className="FeedbackCard__category">{props.category}</p>
                </section>
            </section>

            <button
                className={`FeedbackCard__upvote-btn ${isActive && "FeedbackCard__upvote-btn--active"}`}
                onClick={(e) => handleUpvoteClick(e)}
            >
                <img src={isActive ? iconArrowUpActive : iconArrowUp} alt="upvote" />
                <p>{upvoteCount}</p>
            </button>

            <section className="FeedbackCard__comment-count">
                <img src={iconComments} alt="comments" />
                <p>{props.commentCount}</p>
            </section>
        </Link>
    </section>
);
}
