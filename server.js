const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let db;

async function initDB() {
    try {
        // Connect to Railway DB
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: Number(process.env.DB_PORT)
        });

        console.log("Connected to Railway DB");

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255)
            )
        `;

        await db.query(createTableQuery);
        console.log("Table 'users' ensured.");

    } catch (err) {
        console.error("Database connection failed:");
        console.error(err);
    }
}

initDB();

app.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("Email and password required");

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);
        res.status(201).send("User registered");
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).send("Email already exists");
        }
        res.status(500).send("Error adding user to database");
    }
});

// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).send("Email and password required");

//     try {
//         const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        
//         if (rows.length === 0) return res.status(401).send("User not found");

//         const valid = await bcrypt.compare(password, rows[0].password);

//         if (valid) {
//             res.status(200).send("Login success");
//         } else {
//             res.status(401).send("Wrong password");
//         }
//     } catch (err) {
//         res.status(500).send("Server Error check your Database");
//     }
// });
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = '${email}'`;

    const [rows] = await db.query(query);

    if (rows.length > 0) {
        res.send("Login success");
    } else {
        res.status(401).send("Invalid");
    }
});
// Since index.html provides login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
