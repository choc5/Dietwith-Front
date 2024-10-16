const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;


app.use(cors({origin: 'http://localhost:3000'}));
// Middleware 설정
app.use(bodyParser.json()); // JSON 파싱을 위한 미들웨어 설정




// MySQL 연결 설정
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root', // 본인의 MySQL 사용자 이름
    password: '1234', // 본인의 MySQL 비밀번호
    database: 'testdb', // 본인의 데이터베이스 이름

});

// 데이터베이스 연결
connection.connect(function(err) {
    if (err) {
      console.error('MySQL connection error: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
  });
// 로그인 API
app.post('/api/login', (req, res) => {
    console.log('Login request received:', req.body);
    const { id, password } = req.body;

    connection.query('SELECT * FROM User_sign WHERE id = ? AND pw = ?', [id, password], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
        }

        if (results.length > 0) {
            res.json({ success: true, message: '로그인 성공' });
        } else {
            res.json({ success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }
    });
});

// 회원가입 API
app.post('/api/register', (req, res) => {
    console.log('join request received:', req.body);
    const { id, password, name,email, type } = req.body;


    const userQuery = 'INSERT INTO Users (user_id, user_name, user_gender, user_height, user_purpose, user_like, user_hate, user_activity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    const defaultUserName = name;
    const defaultUserGender = 'M';
    const defaultUserHeight = null;
    const defaultUserPurpose = null;
    const defaultUserLike = JSON.stringify([]);
    const defaultUserHate = JSON.stringify([]);
    const defaultUserActivity = '보통';

    connection.query(userQuery, [name, defaultUserName, defaultUserGender, defaultUserHeight, defaultUserPurpose, defaultUserLike, defaultUserHate, defaultUserActivity], (err, userResults) => {
        if (err) {
            console.error('Error inserting into Users:', err); // 에러 메시지 출력
            return res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.3', error: err.message });
        }

        const signQuery = 'INSERT INTO User_sign (id, user_id, pw, email, type) VALUES (?, ?, ?, ?, ?)';
        connection.query(signQuery, [id, name, password, email, type], (err, signResults) => {
            if (err) {
                console.error('Error inserting into User_sign:', err);
                return res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.2', error: err.message });
            }
            res.json({ success: true, message: '회원가입이 완료되었습니다.' });
        });
    });
});

app.post('/api/find', (req, res) => {
    console.log('find request received:', req.body);
    const { type, email } = req.body;

    if (type === 'id') {
        // 아이디 찾기 로직
        const query = "SELECT id FROM User_sign WHERE email = ?";
        connection.query(query, [email], (err, results) => { // db -> connection으로 수정
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).json({ success: false, message: '서버 오류' });
            }
            if (results.length > 0) {
                return res.json({ success: true, message: `찾은 아이디: ${results[0].id}` });
            } else {
                return res.json({ success: false, message: '이메일에 해당하는 아이디를 찾을 수 없습니다.' });
            }
        });
    } else if (type === 'pw') {
        // 비밀번호 찾기 로직
        const query = "SELECT id FROM User_sign WHERE email = ?";
        connection.query(query, [email], (err, results) => { // db -> connection으로 수정
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).json({ success: false, message: '서버 오류' });
            }
            if (results.length > 0) {
                // 비밀번호 재설정 로직 (예: 임시 비밀번호 발송 등)
                return res.json({ success: true, message: '비밀번호 재설정 링크가 발송되었습니다.' });
            } else {
                return res.json({ success: false, message: '이메일에 해당하는 계정을 찾을 수 없습니다.' });
            }
        });
    } else {
        return res.status(400).json({ success: false, message: '유효하지 않은 요청입니다.' });
    }
});



// 서버 시작
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


