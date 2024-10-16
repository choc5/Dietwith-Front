const bcrypt = require('bcrypt');
const db = require('../config/db'); 


const registerUser = async (id, userId, password) => {
    const saltRounds = 10; // bcrypt 해싱 라운드
    const hashedPassword = await bcrypt.hash(password, saltRounds); // 비밀번호 암호화

    const query = 'INSERT INTO User_sign (id, user_id, pw) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
        db.query(query, [id, userId, hashedPassword], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


const findUserById = (id) => {
    const query = 'SELECT * FROM User_sign WHERE id = ?';
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = {
    registerUser,
    findUserById,
};
