import React from "react"
import { useDispatch } from 'react-redux'
import "./sass/App.css"
import { Outlet, useLocation } from "react-router-dom"
import { updateCurrentUser, updateCurrentUserUpvotes, updateState } from "./redux/appSlice"
import ScrollToTop from "./components/ScrollToTop"
import axios from "axios";

export default function App(){
    const dispatch = useDispatch()
    const currentUser = {
        currentUserId: "65e0c2dae80fa646118fb53d",
        currentUserImage: "https://i.imgur.com/KS2jXpe.jpg",
        currentUserName: "Zena Kelley",
        currentUserUsername: "velvetround"
    }

    function updateScreenWidth(width){
        dispatch(updateState({screenWidth: width,}))
    }

    React.useEffect(() => {
        const handleWindowResize = () => {
            updateScreenWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleWindowResize);

        // Initialize current user
        dispatch(updateCurrentUser({ currentUser: currentUser })); // To do:replace the userID with proper process if we add login page

        // Initialize current user upvotes
        axios
            .get(`http://localhost:5000/get-user-upvotes/${currentUser.currentUserId}`) // To do: replace the userID with proper process if we add login page
            .then((response) => {
            if (response.status === 200) {
                dispatch(updateCurrentUserUpvotes({ currentUserUpvotes: response.data}))
            }
            })
            .catch((error) => {
                console.error("Error fetching current user's upvote list:", error);
            });
    
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [currentUser] );

    return(
        <section className="app">
            <ScrollToTop />
            <Outlet />
        </section>
    )
}