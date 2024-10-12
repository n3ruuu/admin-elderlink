/* eslint-disable no-undef */
const express = require("express")
const router = express.Router()
const mysql = require("mysql2")

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // replace with your MySQL username
    password: "Neilcarlo13", // replace with your MySQL password
    database: "elderlinkdb",
})

// Endpoint to add health records
router.post("/", (req, res) => {
    const {
        member_id,
        record_date,
        medical_conditions,
        medications,
        allergies,
        guardian_name,
        relationship,
        emergency_contact,
    } = req.body

    const query =
        "INSERT INTO health_records (member_id, record_date, medical_conditions, medications, allergies, guardian_name, relationship, emergency_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    db.query(
        query,
        [
            member_id,
            record_date,
            medical_conditions,
            medications,
            allergies,
            guardian_name,
            relationship,
            emergency_contact,
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message })
            }
            res.status(201).json({
                id: result.insertId,
                message: "Health record added successfully",
            })
        },
    )
})

// Endpoint to get all health records with member names
router.get("/", (req, res) => {
    const query = `
        SELECT hr.*, m.name 
        FROM health_records hr 
        JOIN members m ON hr.member_id = m.id
    `

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.status(200).json(results) // Send the health records back as JSON
    })
})

module.exports = router
