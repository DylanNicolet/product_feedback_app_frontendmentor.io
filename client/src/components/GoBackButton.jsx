import React from "react";
import { Link } from 'react-router-dom'
import iconArrowLeft from "../assets/shared/icon-arrow-left.svg"

export default function GoBackButton() {
    return (
        <Link className="go-back-button" to={`..`}>
            <img src={iconArrowLeft} alt="" />
            Go Back
        </Link>
    )
}