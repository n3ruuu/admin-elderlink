/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const healthRecordsRouter = require("./routes/healthRecords") // Import the health records router
const financialAssistanceRouter = require("./routes/financialAssistance")
const eventsRouter = require("./routes/events") // Import the events router

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // replace with your MySQL username
    password: "Neilcarlo13", // replace with your MySQL password
    database: "elderlinkdb",
})

db.connect((err) => {
    if (err) throw err
    console.log("MySQL connected...")
})

// Endpoint to add a member
app.post("/members", (req, res) => {
    const { idNo, name, dob, gender, address, phone, age } = req.body // Replacing email with idNo and moving it first
    const query =
        "INSERT INTO members (idNo, name, dob, gender, address, phone, age) VALUES (?, ?, ?, ?, ?, ?, ?)" // Updated query to remove email and include idNo first
    db.query(
        query,
        [idNo, name, dob, gender, address, phone, age], // Update the order to reflect idNo first
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message })
            }
            res.status(201).json({
                id: result.insertId,
                message: "Member added successfully",
            })
        },
    )
})

// Endpoint to get all members
app.get("/members", (req, res) => {
    const query = "SELECT * FROM members"
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.status(200).json(results) // Send the results back as JSON
    })
})

// Function to update a member in the database
const updateMemberInDatabase = (memberId, updatedMemberData) => {
    return new Promise((resolve, reject) => {
        const query =
            "UPDATE members SET idNo = ?, name = ?, dob = ?, gender = ?, address = ?, phone = ?, age = ? WHERE id = ?" // Update query to use idNo instead of email
        db.query(
            query,
            [
                updatedMemberData.idNo, // Update to reflect idNo
                updatedMemberData.name,
                updatedMemberData.dob,
                updatedMemberData.gender,
                updatedMemberData.address,
                updatedMemberData.phone,
                updatedMemberData.age,
                memberId,
            ],
            (err, result) => {
                if (err) {
                    return reject(err)
                }
                if (result.affectedRows === 0) {
                    return reject(new Error("Member not found"))
                }
                resolve({ id: memberId, ...updatedMemberData })
            },
        )
    })
}

app.put("/members/:id", (req, res) => {
    const memberId = req.params.id // This should be the ID passed in the URL
    const updatedMemberData = req.body

    updateMemberInDatabase(memberId, updatedMemberData)
        .then((updatedMember) => {
            res.status(200).json(updatedMember) // Return the updated member
        })
        .catch((error) => {
            console.error("Error updating member in the database:", error)
            res.status(500).send("Internal Server Error")
        })
})

// Endpoint to archive a member
app.put("/members/archive/:id", (req, res) => {
    const memberId = req.params.id // Get the ID from the URL
    const { status } = req.body // Get the status (reason) from the request body
    const query = "UPDATE members SET status = ? WHERE id = ?" // Update the query to use the status

    db.query(query, [status, memberId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Member not found" })
        }
        res.status(200).json({ message: "Member archived successfully" })
    })
})

// Endpoint to search members by name
app.get("/members/search", (req, res) => {
    const searchTerm = req.query.q || "" // Get the search term from query parameters
    const query = "SELECT id, name FROM members WHERE name LIKE ?"

    db.query(query, [`%${searchTerm}%`], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.status(200).json(results) // Return the results as JSON
    })
})

// Use health records routes
app.use("/health-records", healthRecordsRouter) // Connect health records routes
app.use("/financial-assistance", financialAssistanceRouter)
app.use("/events", eventsRouter)

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
