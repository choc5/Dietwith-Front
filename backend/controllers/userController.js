const { registerUser, findUserById } = require('../services/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 회원가입 처리
const register = async (req, res) => {
    const { id, userId, password } = req.body;

    try {
        await registerUser(id, userId, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

const login = async (req, res) => {
    const { id, password } = req.body;

    try {
        const users = await findUserById(id);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid ID or password' });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.pw);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid ID or password' });
        }

        const token = jwt.sign({ id: user.user_id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
    }
};

module.exports = {
    register,
    login,
};
