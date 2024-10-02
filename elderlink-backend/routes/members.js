/* eslint-disable no-undef */
// routes/members.js
const express = require("express")
const { updateMemberInDatabase } = require("../controllers/membersController") // Import the controller
const router = express.Router()

// Route for updating a member
router.put("/:id", async (req, res) => {
    const memberId = req.params.id
    const updatedMemberData = req.body

    try {
        const updatedMember = await updateMemberInDatabase(
            memberId,
            updatedMemberData,
        )
        res.status(200).json(updatedMember)
    } catch (error) {
        console.error("Error updating member in the database:", error)
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router
