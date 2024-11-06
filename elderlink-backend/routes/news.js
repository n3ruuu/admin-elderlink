/* eslint-disable no-undef */
const express = require("express")
const router = express.Router()
const mysql = require("mysql2")
const multer = require("multer")
const path = require("path")

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // replace with your MySQL username
    password: "Neilcarlo13", // replace with your MySQL password
    database: "elderlinkdb",
})

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/") // Folder to store images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)) // Unique filename with timestamp
    },
})
const upload = multer({ storage: storage })

// Fetch all active news articles
router.get("/", (req, res) => {
    const query =
        "SELECT id, headline, author, body, date, image, status FROM news WHERE status = 'Active'"

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error executing query:", err.message)
            return res.status(500).json({
                error: "An error occurred while fetching news articles.",
            })
        }
        res.status(200).json(results)
    })
})

// Add a new news article with image upload
router.post("/", upload.single("image"), (req, res) => {
    const { headline, author, body, date } = req.body
    const image = req.file ? req.file.filename : null // Store filename if image is uploaded

    // Validate required fields
    if (!headline || !author || !body) {
        return res
            .status(400)
            .json({ error: "Headline, author, and body are required." })
    }

    const query = `
        INSERT INTO news (headline, author, body, date, image, status) 
        VALUES (?, ?, ?, ?, ?, 'Active')
    `

    // Use the provided date or the current date if not specified
    const articleDate = date || new Date()

    db.query(
        query,
        [headline, author, body, articleDate, image],
        (err, result) => {
            if (err) {
                console.error("Error inserting new article:", err.message)
                return res.status(500).json({
                    error: "An error occurred while adding the news article.",
                })
            }
            res.status(201).json({
                message: "News article added successfully",
                articleId: result.insertId,
            })
        },
    )
})

// Edit a news article by ID
router.put("/:id", upload.single("image"), (req, res) => {
    const { id } = req.params
    const { headline, author, body, date } = req.body
    const image = req.file ? req.file.filename : null

    // Validate required fields
    if (!headline || !author || !body) {
        return res
            .status(400)
            .json({ error: "Headline, author, and body are required." })
    }

    // Build the query and parameters dynamically, allowing image to be optional
    let query = "UPDATE news SET headline = ?, author = ?, body = ?, date = ?"
    const params = [headline, author, body, date || new Date()]

    if (image) {
        query += ", image = ?"
        params.push(image)
    }
    query += " WHERE id = ?"
    params.push(id)

    db.query(query, params, (err, result) => {
        if (err) {
            console.error("Error updating article:", err.message)
            return res.status(500).json({
                error: "An error occurred while updating the news article.",
            })
        }
        res.status(200).json({ message: "News article updated successfully" })
    })
})

module.exports = router
