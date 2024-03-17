import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from 'axios'
import SideBar from "../components/SideBar"
import NoFeedback from "../components/NoFeedback"
import FeedbackCard from "../components/FeedbackCard"

export default function Homepage() {

    // States
    const activeFilter = useSelector(state => state.appState.activeFilter)
    const [backendData, setBackendData] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Filter change
    useEffect(() => {
        if (!isInitialLoad) {
            const lowercaseFilter = activeFilter.toLowerCase();
            axios.get(`http://localhost:5000/get-filtered-feedbacks/${lowercaseFilter}`)
                .then(response => {
                    setBackendData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else {
            setIsInitialLoad(false);
        }
    }, [activeFilter, isInitialLoad]);

    return (
        <main className="homepage">
            <SideBar />
            <section className="feedback-container">
            {backendData && backendData.length === 0 && <NoFeedback />}

                {backendData === null ? (
                    <p>Loading...</p>
                ) : (
                    backendData.map((feedback, index) => (
                        <FeedbackCard
                            key={index}
                            id={feedback._id}
                            title={feedback.title}
                            description={feedback.description}
                            category={feedback.category}
                            upvotes={feedback.upvotes}
                            commentCount={feedback.comments ? feedback.comments.length : 0}
                        />
                    ))
                )}
            </section>
        </main>
    );
}