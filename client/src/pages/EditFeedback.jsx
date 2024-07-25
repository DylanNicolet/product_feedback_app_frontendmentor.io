import React from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom'
import GoBackButton from "../components/GoBackButton";

export default function() {
    const [feedbackData, setFeedbackData] = React.useState({})
    const [title, setTitle] = React.useState('')
    const [category, setCategory] = React.useState('')
    const [status, setStatus] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [errorTitle, setErrorTitle] = React.useState(false)
    const [errorDescription, setErrorDescription] = React.useState(false)

    // Grab ID from URL
    const { feedbackId } = useParams()

    React.useEffect(() => {
        getDataOfCurrentFeedback()
    },[])

    // Function to get data of the current feedback
    function getDataOfCurrentFeedback() {
        axios.get(`http://localhost:5000/get-single-feedback/${feedbackId}`)
        .then(response => {
            setFeedbackData(response.data)
            setTitle(response.data.title)
            setCategory(response.data.category)
            setStatus(response.data.status)
            setDescription(response.data.description)
            console.log(response.data)
            console.log(response.data.status);
        })
        .catch(error => {
            console.error('Error fetching data:', error)
        });
    }

    return(
        <main className="EditFeedback">
            <GoBackButton />

            <form className="EditFeedback-form container-primary">
                <div className="pen-icon">+</div>

                <h1>Editing '{title}'</h1>

                {/* Title */}
                <label htmlFor="title">Feedback Title</label>
                <p className="sub-label">Add a short, descriptive headline</p>
                <input 
                    id="title" 
                    className={errorTitle ? "input-error" : undefined} 
                    name="title" 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                />
                <section className="error-section">
                    {errorTitle && <p className="text-error">Can't be empty</p>}
                </section>

                {/* Category */}
                <label htmlFor="category">Category</label>
                <p className="sub-label">Choose a category for your feedback</p>
                <select 
                    id="category" 
                    name="category"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    <option value="Feature">Feature</option>
                    <option value="Enhancement">Enhancement</option>
                    <option value="Bug">Bug</option>
                    <option value="UI">UI</option>
                    <option value="UX">UX</option>
                </select>

                {/* Update Status */}
                <label htmlFor="status">Update Status</label>
                <p className="sub-label">Change feature state</p>
                <select 
                    id="status" 
                    name="status" 
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                >
                    <option value="suggestion">Suggestion</option>
                    <option value="planned">Planned</option>
                    <option value="in-progress">In-progress</option>
                    <option value="live">Live</option>
                </select>

                {/* Feedback Detail */}
                <label htmlFor="description">Feedback Detail</label>
                <p className="sub-label">Include a specific comments on what should be improved, added, etc.</p>
                <textarea 
                    id="description" 
                    className={errorDescription ? "input-error" : undefined} 
                    type="textArea" 
                    name="description" 
                    rows="5"
                    value={description}
                    onChange={e => setDescription(e.target.value)} 
                />
                <section className="error-section">
                    {errorDescription && <p className="text-error">Can't be empty</p>}
                </section>
            </form>
        </main>
    )
}