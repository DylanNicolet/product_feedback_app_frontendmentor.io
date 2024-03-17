// Importing required MongoDB client
const { MongoClient } = require('mongodb')

let dbConnection

module.exports = {
    // Function to connect to the MongoDB database
    connectToDb: (cb) => {
        // Connecting to the MongoDB database using Atlas or Compass
        MongoClient.connect('mongodb://localhost:27017/feedback_app')
            .then((client) => {
                // Upon successful connection, set the database connection
                dbConnection = client.db()
                // Callback to indicate successful connection
                return cb()
            })
            .catch(err => {
                // Log any errors that occur during connection
                console.log(err)
                // Callback to propagate error if connection fails
                return cb(err)
            })
    },
    // Function to get the reference to the connected database
    getDb: () => dbConnection
}