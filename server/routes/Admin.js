/* eslint-disable no-undef */
const express = require("express")
const router = express.Router()
const { Admin } = require("../models")

router.get("/", async (req, res) => {
    const listOfAdmins = await Admin.findAll()
    res.json(listOfAdmins)
})

router.post("/", async (req, res) => {
    const post = req.body
    await Admin.create(post)
    res.json(post)
})

module.exports = router
