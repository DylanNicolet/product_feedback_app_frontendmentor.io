import React from "react"
import { Link } from "react-router-dom"

export default function DeployedNav(){
    return(
        <nav className="deployed-nav">
            <ul>
                <li><Link to={`/`}>HOME</Link></li>
                <li><Link to={`headphones`}>HEADPHONES</Link></li>
                <li><Link to={`speakers`}>SPEAKERS</Link></li>
                <li><Link to={`earphones`}>EARPHONES</Link></li>
            </ul>
        </nav>
    )
}