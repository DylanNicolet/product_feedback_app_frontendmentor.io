import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import SideBar from "../components/SideBar"


export default function Homepage(){
    const screenWidth = useSelector( state => state.appState.screenWidth )

    return(
        <main className="homepage">
            <SideBar />
        </main>
    )
}