/* eslint-disable no-undef */
// server.js
const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

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
    const { name, dob, gender, address, phone, email, age } = req.body
    const query =
        "INSERT INTO members (name, dob, gender, address, phone, email, age) VALUES (?, ?, ?, ?, ?, ?, ?)"
    db.query(
        query,
        [name, dob, gender, address, phone, email, age],
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
            "UPDATE members SET name = ?, dob = ?, gender = ?, address = ?, phone = ?, email = ?, age = ? WHERE id = ?"
        db.query(
            query,
            [
                updatedMemberData.name,
                updatedMemberData.dob,
                updatedMemberData.gender,
                updatedMemberData.address,
                updatedMemberData.phone,
                updatedMemberData.email,
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
    const memberId = req.params.id
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

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
