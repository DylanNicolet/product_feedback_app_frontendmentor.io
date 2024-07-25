// Importing necessary modules
const express = require('express')
const cors = require('cors');
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./database')

// Creating an Express application
const app = express()
app.use(express.json())
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

    if (filterValue !== "All") {
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

// Get all user upvotes
app.get('/get-user-upvotes/:userId', (req, res) => {
    db.collection('users')
        .findOne({ _id: new ObjectId(req.params.userId) })
        .then(user => {
            res.status(200).json(user.feedbackUpvoted)
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

// remove feedback ID from user's document
app.patch('/remove-from-user-upvotes/:feedbackId/:userId', (req, res) => {
    if (ObjectId.isValid(req.params.userId)) {
        db.collection('users')
            .updateOne({ _id: new ObjectId(req.params.userId) }, { $pull: { feedbackUpvoted: req.params.feedbackId } })
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

// Find one feedback by _id
app.get('/get-single-feedback/:feedbackId', (req, res) => {
    db.collection('feedbacks')
        .findOne({ _id: new ObjectId(req.params.feedbackId) })
        .then(feedback => {
            res.status(200).json(feedback)
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({ error: "Could not fetch the document" })
        })
})

// Add a new comment to a feedback
app.post(`/add-comment-to-feedback/:feedbackId`, (req, res) => {
    const feedbackId = req.params.feedbackId;
    const commentData = req.body.commentData;

    if (!commentData || !commentData.content) {
        return res.status(400).json({ error: "Invalid comment data" });
    }

    // Generate a unique comment ID
    const commentId = new ObjectId();

    const newComment = {
        id: commentId,
        content: commentData.content,
        user: {
            image: commentData.user.image,
            name: commentData.user.name,
            username: commentData.user.username
        }
    };

    // Update the feedback document with the new comment
    db.collection('feedbacks')
        .updateOne(
            { _id: new ObjectId(feedbackId) },
            { $push: { comments: newComment } }
        )
        .then(result => {
            if (result.modifiedCount > 0) {
                res.status(200).json({ message: "Comment added successfully", commentId: commentId });
            } else {
                res.status(404).json({ error: "Feedback not found" });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Could not add comment to this Feedback" });
        });
})

// Add a new reply to a comment
app.post(`/add-reply-to-comment/:feedbackId/:commentId`, (req, res) => {
    const feedbackId = req.params.feedbackId;
    const commentId = req.params.commentId;
    const replyData = req.body.replyData;

    if (!replyData || !replyData.content) {
        return res.status(400).json({ error: "Invalid reply data" });
    }

    // Update the feedback document with the new reply to comment
    db.collection('feedbacks')
        .updateOne(
            {
                _id: new ObjectId(feedbackId),
                'comments.id': new ObjectId(commentId)
            },
            {
                $push: { 'comments.$.replies': replyData }
            }
        )
        .then(result => {
            if (result.modifiedCount > 0) {
                res.status(200).json({ message: "Reply added successfully", commentId: commentId });
            } else {
                res.status(404).json({ error: "Feedback or comment not found" });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Could not add reply to the comment" });
        });
})

// Add a new Feedback to the database
app.post('/add-new-feedback', (req, res) => {
    const newFeedback = req.body;

    db.collection('feedbacks')
        .insertOne(newFeedback)
        .then(result => {
            console.log("Insertion result:", result);
            if (result.insertedId) {
                res.status(201).json({ _id: result.insertedId, ...newFeedback });
            } else {
                throw new Error("Insertion failed, no insertedId returned");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Could not add the feedback" });
        });
});