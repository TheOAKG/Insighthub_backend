const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: true
});

pool.on('connect', () => {
    console.log("InsightHub Database connected successfully");
});

const initializeDatabase = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'student',
                department VARCHAR(100),
                created_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                abstract TEXT NOT NULL,
                department VARCHAR(100) NOT NULL,
                supervisor VARCHAR(100) NOT NULL,
                completion_year INTEGER NOT NULL,
                file_url TEXT,
                demo_link TEXT,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                comment_text TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS bookmarks (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
                UNIQUE(user_id, project_id)
            );
        `);
        console.log("InsightHub: Systems Architecture Ready.");
    } catch (err) {
        console.error("Database Init Error:", err.message);
    }
};

initializeDatabase();

app.get('/api/health', (req, res) => res.json({ status: 'live' }));

app.get('/api/projects', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT projects.*, users.username 
            FROM projects 
            JOIN users ON projects.user_id = users.id 
            WHERE status = 'approved' OR status = 'pending'
            ORDER BY created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/register', async (req, res) => {
    const { username, email, password, department } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO users (username, email, password, department) VALUES ($1, $2, $3, $4) RETURNING id, username, role",
            [username, email, password, department]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: "Registration failed. Email may exist." });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];
        if (user && user.password === password) {
            res.json({ userId: user.id, username: user.username, role: user.role });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post('/api/projects', async (req, res) => {
    const { user_id, title, abstract, department, supervisor, year, file_url, demo_link } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO projects (user_id, title, abstract, department, supervisor, completion_year, file_url, demo_link) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [user_id, title, abstract, department, supervisor, year, file_url, demo_link]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Submission failed" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.listen(PORT, () => console.log(`Server live on http://localhost:${PORT}`));