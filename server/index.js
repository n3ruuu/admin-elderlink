/* eslint-disable no-undef */
const express = require("express")
const app = express()

app.use(express.json())

const db = require("./models")

// Routers
const adminRouter = require("./routes/Admin")
app.use("/admin", adminRouter)

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001")
    })
})
