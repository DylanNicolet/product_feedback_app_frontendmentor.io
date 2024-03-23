import React from "react";
import noFeedbackImage from "../assets/suggestions/illustration-empty.svg"
import ButtonAddFeedback from "../components/ButtonAddFeedback"

export default function NoFeedback() {
    return (
        <section className="NoFeedback container-primary">
            <img className="NoFeeback__image" src={noFeedbackImage} alt="Illustration of a detective holding a search glass" />
            <h2 className="NoFeeback__title">There is no feedback yet.</h2>
            <p className="NoFeeback__text">
                Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app.
            </p>
            <ButtonAddFeedback />
        </section>
    )
}