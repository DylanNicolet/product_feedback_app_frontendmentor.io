import React from "react"
import axios from 'axios'
import GoBackButton from "../components/GoBackButton"

export default function NewFeedback() {
    let [title, setTitle] = React.useState('')
    let [category, setCategory] = React.useState('Feature')
    let [description, setDescription] = React.useState('')
    let [errorTitle, setErrorTitle] = React.useState(false)
    let [errorDescription, setErrorDescription] = React.useState(false)

    // Validate user input
    function validateInput() {
        const errors = {
            title: !title,
            description: !description
        };
        setErrorTitle(errors.title);
        setErrorDescription(errors.description);
        return !errors.title && !errors.description;
    };

    // Handle submition
    function handleSubmit(e) {
        e.preventDefault()

        if (!title) {
            setErrorTitle(true)
        } else {
            setErrorTitle(false)
        }

        if (!description) {
            setErrorDescription(true)
        } else {
            setErrorDescription(false)
        }

        if (title && description) {
            let newFeedbackObject = {
                title: title,
                category: category,
                upvotes: 0,
                status: "suggestion",
                description: description,
                comments: []
            }

            axios.post('http://localhost:5000/add-new-feedback', newFeedbackObject)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error adding the feedback!', error);
            });
        }
    }

    return (
        <main className="NewFeedback">
            <GoBackButton />

            <form className="NewFeedback-form container-primary" onSubmit={handleSubmit}>
                <div className="plus-icon">+</div>

                <h1>Create New Feedback</h1>

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
                {errorTitle && <p className="text-error">Can't be empty</p>}

                <label htmlFor="category">Category</label>
                <p className="sub-label">Choose a category for your feedback</p>
                <select id="category" name="category" onChange={e => setCategory(e.target.value)}>
                    <option value="Feature">Feature</option>
                    <option value="Enhancement">Enhancement</option>
                    <option value="Bug">Bug</option>
                    <option value="UI">UI</option>
                    <option value="UX">UX</option>
                </select>

                <label htmlFor="description">Feedback Description</label>
                <p className="sub-label">Include a specific comments on what should be improved, added, etc.</p>
                <textarea 
                    id="description" 
                    className={errorDescription ? "input-error" : undefined} 
                    type="textArea" 
                    name="description" 
                    rows="5"
                    onChange={e => setDescription(e.target.value)} 
                />
                {errorDescription && <p className="text-error">Can't be empty</p>}

                <section className="submit-btn-container">
                    <button className="button-primary submit" type="submit" >Add Feedback</button>
                    <button className="button-secondary">Cancel</button>
                </section>
            </form>
        </main>
    )
}