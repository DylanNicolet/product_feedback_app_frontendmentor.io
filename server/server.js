// Importing necessary modules
const express = require('express')
const cors = require('cors');
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./database')

// Creating an Express application
const app = express()
//app.use(express.json())
app.use(cors());

let db

// Connecting to the database and starting the Express server
connectToDb((err) => {
    if (!err) {
        app.listen(5000, () => {
            console.log('app listening on port 5000')
        })
        db = getDb()
    }
})

// Filter feedbacks or get initial load feedbacks
app.get('/get-filtered-feedbacks/:filter', (req, res) => {
    const filterValue = req.params.filter;

    let query = {}; // Default query is empty, meaning no filtering

    if (filterValue !== "all") {
        query = { category: filterValue }; // If filterValue is not "all", apply the filter
    }

    db.collection('feedbacks')
        .find(query)
        .toArray()
        .then(feedbacks => {
            res.status(200).json(feedbacks)
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ error: "could not fetch the document" })
        })
})

// Increment like
app.patch('/increment-like/:feedbackId', (req, res) => {
    if (ObjectId.isValid(req.params.feedbackId)) {
        db.collection('feedbacks')
            .updateOne({ _id: new ObjectId(req.params.feedbackId) }, { $inc: { upvotes: 1 } })
            .then(result => {
                if (result.modifiedCount === 1) {
                    res.status(200).json({ message: 'Upvote incremented successfully' });
                } else {
                    res.status(404).json({ error: 'Feedback not found' });
                }
            })
            .catch(err => {
                console.error('Error updating feedback:', err);
                res.status(500).json({ error: 'Could not update the feedback' });
            });
    } else {
        res.status(400).json({ error: 'Invalid feedback ID' });
    }
});

// Add feedback ID to user's document
app.patch('/add-to-user-upvotes/:feedbackId/:userId', (req, res) => {
    if (ObjectId.isValid(req.params.userId)) {
        db.collection('users')
            .updateOne({ _id: new ObjectId(req.params.userId), feedbackUpvoted: { $ne: req.params.feedbackId } }, 
                { $addToSet: { feedbackUpvoted: req.params.feedbackId } })
            .then(result => {
                if (result.modifiedCount === 1) {
                    res.status(200).json({ message: 'Added feedback to upvoted array' });
                } else if (result.matchedCount === 0) {
                    res.status(404).json({ error: 'User not found or feedback already exists' });
                }
            })
            .catch(err => {
                console.error('Error updating user:', err);
                res.status(500).json({ error: 'Could not update the user' });
            });
    } else {
        res.status(400).json({ error: 'Invalid user ID' });
    }
});

// Decrement like
app.patch('/decrement-like/:feedbackId', (req, res) => {
    if (ObjectId.isValid(req.params.feedbackId)) {
        db.collection('feedbacks')
            .updateOne({ _id: new ObjectId(req.params.feedbackId) }, { $inc: { upvotes: -1 } })
            .then(result => {
                if (result.modifiedCount === 1) {
                    res.status(200).json({ message: 'Upvote decremented successfully' });
                } else {
                    res.status(404).json({ error: 'Feedback not found' });
                }
            })
            .catch(err => {
                console.error('Error updating feedback:', err);
                res.status(500).json({ error: 'Could not update the feedback' });
            });
    } else {
        res.status(400).json({ error: 'Invalid feedback ID' });
    }
});

// remove feedback ID from user's document
app.patch('/remove-from-user-upvotes/:feedbackId/:userId', (req, res) => {
    if (ObjectId.isValid(req.params.userId)) {
        db.collection('users')
            .updateOne({ _id: new ObjectId(req.params.userId) }, 
                { $pull: { feedbackUpvoted: req.params.feedbackId } })
            .then(result => {
                if (result.modifiedCount === 1) {
                    res.status(200).json({ message: 'Removed feedback from upvoted array' });
                } else if (result.matchedCount === 0) {
                    res.status(404).json({ error: 'User not found or feedback does not exist in the array' });
                } else {
                    res.status(404).json({ error: 'Feedback does not exist in the array' });
                }
            })
            .catch(err => {
                console.error('Error updating user:', err);
                res.status(500).json({ error: 'Could not update the user' });
            });
    } else {
        res.status(400).json({ error: 'Invalid user ID' });
    }
});