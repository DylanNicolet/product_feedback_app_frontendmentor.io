import React from "react";
import GoBackButton from "../components/GoBackButton";

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
            let newFeedback = {
                title: title,
                category: category,
                upvotes: 0,
                status: "suggestion",
                description: description,
                comments: []
            }

            // ################# continue form validation here
    
            console.log(newFeedback)
        }
    }

    return (
        <main className="NewFeedback">
            <GoBackButton />

            <form className="NewFeedback-form" onSubmit={handleSubmit}>
                <img src="" />

                <h1>Create New Feedback</h1>

                <label htmlFor="title">Feedback Title</label>
                <p>Add a short, descriptive headline</p>
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
                <p>Choose a category for your feedback</p>
                <select id="category" name="category" onChange={e => setCategory(e.target.value)}>
                    <option value="Feature">Feature</option>
                    <option value="Enhancement">Enhancement</option>
                    <option value="Bug">Bug</option>
                    <option value="UI">UI</option>
                    <option value="UX">UX</option>
                </select>

                <label htmlFor="description">Feedback Description</label>
                <p>Include a specific comments on what should be improved, added, etc.</p>
                <textarea 
                    id="description" 
                    className={errorDescription ? "input-error" : undefined} 
                    type="textArea" 
                    name="description" 
                    onChange={e => setDescription(e.target.value)} 
                />
                {errorDescription && <p className="text-error">Can't be empty</p>}

                <button type="submit" >Add Feedback</button>
                <button>Cancel</button>
            </form>
        </main>
    )
}