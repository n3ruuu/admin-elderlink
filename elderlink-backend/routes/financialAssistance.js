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

// Endpoint to add financial assistance
router.post("/", (req, res) => {
    const {
        member_id,
        member_name,
        benefit_type,
        date_of_claim,
        benefit_status,
        claimer,
        relationship,
    } = req.body

    const query = `
        INSERT INTO financial_assistance (member_id, member_name, benefit_type, date_of_claim, benefit_status, claimer, relationship)
        VALUES (?, ?, ?, ?, ?, ?, ?)`

    db.query(
        query,
        [
            member_id,
            member_name,
            benefit_type,
            date_of_claim,
            benefit_status,
            claimer,
            relationship,
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message })
            }
            res.status(201).json({
                financial_assistance_id: result.insertId,
                message: "Financial assistance record added successfully",
            })
        },
    )
})

// Endpoint to get all financial assistance records
router.get("/", (req, res) => {
    const query = "SELECT * FROM financial_assistance"
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }
        res.status(200).json(results)
    })
})

// Endpoint to update financial assistance
router.put("/:id", (req, res) => {
    const financialAssistanceId = req.params.id
    const {
        member_id,
        member_name,
        benefit_type,
        date_of_claim,
        benefit_status,
        claimer,
        relationship,
    } = req.body

    const query = `
        UPDATE financial_assistance 
        SET member_id = ?, member_name = ?, benefit_type = ?, date_of_claim = ?, benefit_status = ?, claimer = ?, relationship = ?
        WHERE financial_assistance_id = ?`

    db.query(
        query,
        [
            member_id,
            member_name,
            benefit_type,
            date_of_claim,
            benefit_status,
            claimer,
            relationship,
            financialAssistanceId,
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message })
            }
            if (result.affectedRows === 0) {
                return res
                    .status(404)
                    .json({ message: "Financial assistance record not found" })
            }
            res.status(200).json({
                message: "Financial assistance record updated successfully",
            })
        },
    )
})

module.exports = router
