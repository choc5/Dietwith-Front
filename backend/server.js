const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1q2w3e4r',
    database: 'testdb' 
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});

// 로그인 API
app.post('/api/login', (req, res) => {
    const { id, password } = req.body;
    const query = 'SELECT * FROM User_sign WHERE id = ?';
    db.query(query, [id], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid ID or password' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.pw);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid ID or password' });
        }
        const token = jwt.sign({ id: user.user_id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
