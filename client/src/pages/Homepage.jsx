import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from 'axios'
import SideBar from "../components/SideBar"
import NoFeedback from "../components/NoFeedback"
import FeedbackCard from "../components/FeedbackCard"
import ButtonAddFeedback from "../components/ButtonAddFeedback"

export default function Homepage() {

    // States
    const activeFilter = useSelector(state => state.appState.activeFilter)
    const [backendData, setBackendData] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Variables

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

    // Handle sorting of data
    function handleSorting(e) {
        if (e.target.value === "most-upvotes") {
            const sortedItems = [...backendData].sort((a, b) => b.upvotes - a.upvotes);
            setBackendData(sortedItems);

        } else if (e.target.value === "least-upvotes") {
            const sortedItems = [...backendData].sort((a, b) => a.upvotes - b.upvotes);
            setBackendData(sortedItems);

        } else if (e.target.value === "most-comments") {
            const sortedItems = [...backendData].sort((a, b) => {
                // Set comment length as 0 if comments are undefined or null
                const commentsLengthA = a.comments ? a.comments.length : 0;
                const commentsLengthB = b.comments ? b.comments.length : 0;
                return commentsLengthB - commentsLengthA;
            });
            setBackendData(sortedItems);
            
        } else if (e.target.value === "least-comments") {
            const sortedItems = [...backendData].sort((a, b) => {
                // Set comment length as 0 if comments are undefined or null
                const commentsLengthA = a.comments ? a.comments.length : 0;
                const commentsLengthB = b.comments ? b.comments.length : 0;
                return commentsLengthA - commentsLengthB;
            });
            setBackendData(sortedItems);
        }
    }    

    return (
        <main className="homepage">
            {/* Menu - sidebar */}
            <SideBar />

            {/* Sorting */}
            <section className="sort-container">
                <section className="dropdown-container">
                    <p>Sort by : </p>
                    <select name="sort-by" id="sort-by-selector" onChange={e => handleSorting(e)}>
                        <option value="most-upvotes">Most Upvotes</option>
                        <option value="least-upvotes">Least Upvotes</option>
                        <option value="most-comments">Most Comments</option>
                        <option value="least-comments">Least Comments</option>
                    </select>
                </section>

                <ButtonAddFeedback />
            </section>


            {/* Feedbacks */}
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