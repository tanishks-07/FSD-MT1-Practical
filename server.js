
// 1. Import Express
const express = require("express");

// 2. Create Express application
const app = express();

// 3. Middleware to read JSON data
app.use(express.json());

// 4. Define port
const PORT = 3000;

// 5. Initial registration data
let registrations = [
    {
        id: 501,
        participantName: "Riya Sharma",
        eventName: "Tech Fest",
        department: "CSE",
        ticketCount: 2,
        paymentStatus: "Paid"
    },
    {
        id: 502,
        participantName: "Arjun Mehta",
        eventName: "Code Sprint",
        department: "IT",
        ticketCount: 1,
        paymentStatus: "Pending"
    },
    {
        id: 503,
        participantName: "Neha Verma",
        eventName: "Tech Fest",
        department: "ECE",
        ticketCount: 3,
        paymentStatus: "Paid"
    }
];

// 6. GET all registrations
app.get("/api/registrations", (req, res) => {
    res.status(200).json(registrations);
});

// GET registration by ID
app.get("/api/registrations/:id", (req, res) => {

    const id = Number(req.params.id);

    const registration = registrations.find(r => r.id === id);

    if (!registration) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    res.status(200).json(registration);

});


// Start server (keep this at the bottom)
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});


// POST - Add new registration
app.post("/api/registrations", (req, res) => {

    const data = req.body;

    // Validate input
    if (
        !data.participantName ||
        !data.eventName ||
        !data.department ||
        !Number.isInteger(data.ticketCount) ||
        data.ticketCount <= 0 ||
        !["Paid", "Pending"].includes(data.paymentStatus)
    ) {
        return res.status(400).json({
            message: "Invalid registration data"
        });
    }

    // Generate unique ID
    const newRegistration = {
        id: Math.max(...registrations.map(r => r.id), 500) + 1,
        participantName: data.participantName,
        eventName: data.eventName,
        department: data.department,
        ticketCount: data.ticketCount,
        paymentStatus: data.paymentStatus
    };

    // Add record to array
    registrations.push(newRegistration);

    // Send response
    res.status(201).json({
        message: "Registration added successfully",
        registration: newRegistration
    });

});



// PUT - Update registration by ID
app.put("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = registrations.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    registrations[index] = {
        id,
        ...req.body
    };

    res.status(200).json({
        message: "Registration updated successfully",
        registration: registrations[index]
    });
});