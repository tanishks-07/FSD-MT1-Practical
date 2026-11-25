const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

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
        ticketCount: 3,
        paymentStatus: "Pending"
    },
    {
        id: 503,
        participantName: "Neha Verma",
        eventName: "Tech Fest",
        department: "ECE",
        ticketCount: 1,
        paymentStatus: "Paid"
    }
];

let nextId = 504;

function validateRegistration(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return "Request body must be a JSON object";
    }

    const { participantName, eventName, department, ticketCount, paymentStatus } = data;

    if (
        typeof participantName !== "string" || !participantName.trim() ||
        typeof eventName !== "string" || !eventName.trim() ||
        typeof department !== "string" || !department.trim()
    ) {
        return "All text fields are required";
    }

    if (!Number.isInteger(ticketCount) || ticketCount <= 0) {
        return "ticketCount must be a positive integer";
    }

    if (!["Paid", "Pending"].includes(paymentStatus)) {
        return "paymentStatus must be Paid or Pending";
    }

    return null;
}

app.get("/api/registrations", (req, res) => {
    res.status(200).json(registrations);
});

app.post("/api/registrations", (req, res) => {
    const error = validateRegistration(req.body);

    if (error) {
        return res.status(400).json({ message: error });
    }

    const newRegistration = {
        id: nextId++,
        participantName: req.body.participantName.trim(),
        eventName: req.body.eventName.trim(),
        department: req.body.department.trim(),
        ticketCount: req.body.ticketCount,
        paymentStatus: req.body.paymentStatus
    };

    registrations.push(newRegistration);

    res.status(201).json(newRegistration);
});

app.get("/api/registrations/pending", (req, res) => {
    const result = registrations.filter(
        (r) => r.paymentStatus === "Pending"
    );

    res.status(200).json(result);
});

app.get("/api/registrations/filter", (req, res) => {
    const department = req.query.department;

    if (typeof department !== "string" || !department.trim()) {
        return res.status(400).json({
            message: "Please provide a department"
        });
    }

    const result = registrations.filter(
        (r) =>
            r.department.toLowerCase() === department.trim().toLowerCase()
    );

    res.status(200).json(result);
});

app.get("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);

    const registration = registrations.find(
        (r) => r.id === id
    );

    if (!registration) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    res.status(200).json(registration);
});

app.put("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);

    const registration = registrations.find(
        (r) => r.id === id
    );

    if (!registration) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    const error = validateRegistration(req.body);

    if (error) {
        return res.status(400).json({ message: error });
    }

    registration.participantName = req.body.participantName.trim();
    registration.eventName = req.body.eventName.trim();
    registration.department = req.body.department.trim();
    registration.ticketCount = req.body.ticketCount;
    registration.paymentStatus = req.body.paymentStatus;

    res.status(200).json(registration);
});

app.delete("/api/registrations/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = registrations.findIndex(
        (r) => r.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Registration not found"
        });
    }

    registrations.splice(index, 1);

    res.status(200).json({
        message: "Registration deleted successfully"
    });
});

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
