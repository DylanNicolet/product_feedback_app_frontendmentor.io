import React from "react";
import noFeedbackImage from "../assets/suggestions/illustration-empty.svg"
import addFeedbackIcon from "../assets/shared/icon-plus.svg"

export default function NoFeedback() {
    return (
        <section className="NoFeedback container-primary">
            <img className="NoFeeback__image" src={noFeedbackImage} alt="Illustration of a detective holding a search glass" />
            <h2 className="NoFeeback__title">There is no feedback yet.</h2>
            <p className="NoFeeback__text">
                Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app.
            </p>
            <button className="NoFeeback__add-button button-primary">
                <img src={addFeedbackIcon} alt="Plus sign" />
                Add Feedback
            </button>
        </section>
    )
}