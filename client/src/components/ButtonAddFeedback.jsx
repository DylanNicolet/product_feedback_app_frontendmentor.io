import React from "react"
import { Link } from "react-router-dom"
import addFeedbackIcon from "../assets/shared/icon-plus.svg"

export default function NoFeedback() {
    return (
        <Link className="button-add-feedback button-primary" to={`/new-feedback`}>
            <img src={addFeedbackIcon} alt="Plus sign" />
            Add Feedback
        </Link>
    )
}