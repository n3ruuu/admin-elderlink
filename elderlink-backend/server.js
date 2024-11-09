/* eslint-disable no-undef */
const express = require("express")
const cors = require("cors")
const healthRecordsRouter = require("./routes/healthRecords")
const financialAssistanceRouter = require("./routes/financialAssistance")
const eventsRouter = require("./routes/events")
const newsRouter = require("./routes/news")
const membersRouter = require("./routes/members") // Import the new members router
const formsRouter = require("./routes/forms")

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

// Use members routes
app.use("/members", membersRouter) // Use members routes

// Use other routes
app.use("/health-records", healthRecordsRouter)
app.use("/financial-assistance", financialAssistanceRouter)
app.use("/events", eventsRouter)
app.use("/news", newsRouter)
app.use("/forms", formsRouter)

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
