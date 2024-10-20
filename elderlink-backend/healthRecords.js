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

// POST: Add a new health record
router.post("/", (req, res) => {
    const {
        member_id,
        member_name, // New field for member name
        record_date,
        medical_conditions,
        medications,
        guardian_name,
        relationship,
        emergency_contact,
    } = req.body

    const query = `
        INSERT INTO health_records 
        (member_id, member_name, record_date, medical_conditions, medications, guardian_name, relationship, emergency_contact) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    db.query(
        query,
        [
            member_id,
            member_name, // Include member name in the query
            record_date,
            medical_conditions,
            medications,
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

// GET: Fetch all health records (with member names, removed 'allergies')
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
        res.status(200).json(results)
    })
})

module.exports = router
