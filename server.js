
const express = require('express');
const session = require('express-session');
const mysql = require('mysql2'); // mysql2로 변경
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3001;
app.use(express.json());

// CORS 설정



// Middleware 설정
app.use(bodyParser.json()); // JSON 파싱을 위한 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer 설정 (파일 업로드)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 파일 저장 경로
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 설정
    }
});
const upload = multer({ storage: storage }); // upload 변수 정의

app.use(session({
    secret: '1234', // 비밀 키
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // HTTPS 사용 시 true로 설정
        maxAge: 30 * 60 * 1000 // 세션 유효 기간을 30분으로 설정
    }
}));

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
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
            const userId = results[0].user_id;
            req.session.userId = userId; 
            console.log('User ID saved in session:', req.session.userId);
            res.json({ success: true, message: '로그인 성공' , userId });
        } else {
            res.json({ success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' });
        }
    });
});
//아이디 중복
app.post('/api/check-duplicate/id', (req, res) => {
    const { id } = req.body;

    const checkIdQuery = `
        SELECT 'id' AS type FROM User_sign WHERE id = ?;
    `;

    connection.query(checkIdQuery, [id], (err, results) => {
        if (err) {
            console.error('아이디 중복 확인 쿼리 오류:', err);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }

        const isDuplicate = results.length > 0; // 중복 여부
        res.json({
            success: true,
            isDuplicate,
            message: isDuplicate ? '아이디가 이미 존재합니다.' : '사용 가능한 아이디입니다.'
        });
    });
});
//이메일 중복
app.post('/api/check-duplicate/email', (req, res) => {
    const { email } = req.body;

    const checkEmailQuery = `
        SELECT 'email' AS type FROM User_sign WHERE email = ?;
    `;

    connection.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error('이메일 중복 확인 쿼리 오류:', err);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }

        const isDuplicate = results.length > 0; // 중복 여부
        res.json({
            success: true,
            isDuplicate,
            message: isDuplicate ? '이메일이 이미 존재합니다.' : '사용 가능한 이메일입니다.'
        });
    });
});
//이름 중복
app.post('/api/check-duplicate/name', (req, res) => {
    const { name } = req.body;

    const checkNameQuery = `
        SELECT 'name' AS type FROM Users WHERE user_id = ?;  
    `;

    connection.query(checkNameQuery, [name], (err, results) => {
        if (err) {
            console.error('이름 중복 확인 쿼리 오류:', err);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }

        const isDuplicate = results.length > 0; // 중복 여부
        res.json({
            success: true,
            isDuplicate,
            message: isDuplicate ? '이름이 이미 존재합니다.' : '사용 가능한 이름입니다.'
        });
    });
});
// 회원가입 API
app.post('/api/register', (req, res) => {
    console.log('join request received:', req.body);
    const { id, password, name, email, type } = req.body;

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
            console.error('Error inserting into Users:', err);
            return res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.', error: err.message });
        }

        const signQuery = 'INSERT INTO User_sign (id, user_id, pw, email, type) VALUES (?, ?, ?, ?, ?)';
        connection.query(signQuery, [id, name, password, email, type], (err, signResults) => {
            if (err) {
                console.error('Error inserting into User_sign:', err);
                return res.status(500).json({ success: false, message: '회원가입 중 오류가 발생했습니다.', error: err.message });
            }
            res.json({ success: true, message: '회원가입이 완료되었습니다.' });
        });
    });
});

// 아이디 및 비밀번호 찾기 API
app.post('/api/find', (req, res) => {
    console.log('find request received:', req.body);
    const { type, email } = req.body;

    if (type === 'id') {
        const query = "SELECT id FROM User_sign WHERE email = ?";
        connection.query(query, [email], (err, results) => {
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
        const query = "SELECT id FROM User_sign WHERE email = ?";
        connection.query(query, [email], (err, results) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).json({ success: false, message: '서버 오류' });
            }
            if (results.length > 0) {
                return res.json({ success: true, message: '비밀번호 재설정 링크가 발송되었습니다.' });
            } else {
                return res.json({ success: false, message: '이메일에 해당하는 계정을 찾을 수 없습니다.' });
            }
        });
    } else {
        return res.status(400).json({ success: false, message: '유효하지 않은 요청입니다.' });
    }
});

// 업로드 API
app.post('/api/upload', upload.single('image'), (req, res) => {
    console.log('Upload request received:', req.body);
    
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: '로그인 세션이 만료되었습니다. 다시 로그인 해주세요.' });

    }

    const { type, description } = req.body; // type과 description을 받음
    const imageSrc = req.file ? req.file.path : null; // 이미지 파일 경로

    // 메뉴 리스트 처리
    const menuList = req.body['menuList'] || ''; // menuList를 문자열로 가져오기
    let parsedMenuList = [];

    // 메뉴 리스트가 문자열인 경우
    if (typeof menuList === 'string') {
        try {
            parsedMenuList = JSON.parse(menuList); // 문자열을 JSON으로 변환
            // 배열이 아닌 경우 배열로 감싸기
            if (!Array.isArray(parsedMenuList)) {
                parsedMenuList = [parsedMenuList];
            }
        } catch (error) {
            console.error('메뉴 리스트 파싱 오류:', error);
            return res.status(400).json({ success: false, message: '메뉴 리스트 파싱 오류' });
        }
    }

    // 디버깅 로그
    console.log('Parsed Menu List:', parsedMenuList); // 파싱된 메뉴 리스트 로그 추가

    // 피드 데이터 삽입
    const feedQuery = 'INSERT INTO feeds (user_id, feed_date, category, content, img_src) VALUES (?, NOW(), ?, ?, ?)';
    
    connection.query(feedQuery, [userId, type, description, imageSrc], (error, results) => {
        if (error) {
            console.error('피드 데이터 삽입 오류:', error);
            return res.status(500).send('서버 오류');
        }

        const feedId = results.insertId; // 방금 삽입된 피드 ID
        console.log('Feed ID:', feedId); // 로그 추가

        // 메뉴 리스트 삽입
        const menuInsertQuery = 'INSERT INTO feed_menu (feed_id, menu_name, menu_calorie) VALUES ?';
        const menuValues = parsedMenuList.length > 0 
            ? parsedMenuList.map(item => [feedId, item.name, parseInt(item.calories)]) 
            : [[feedId, '', 0]]; // 메뉴가 없을 경우 기본값을 삽입 (예: ''와 0 칼로리)

        // 디버깅 로그
        console.log('Menu Values:', menuValues); // 추가된 로그

        connection.query(menuInsertQuery, [menuValues], (error) => {
            if (error) {
                console.error('메뉴 데이터 삽입 오류:', error);
                return res.status(500).send('서버 오류');
            }
            res.json({ success: true, message: '업로드 성공' });
        });
    });
});

// 피드 가져오기 API
app.get('/api/feed', (req, res) => {
    const userId = req.session.userId; // 세션에서 userId 가져오기
    if (!userId) {
        return res.status(401).json({ success: false, message: '로그인 세션이 만료되었습니다.' });
    }
    
    const query = `
    SELECT feeds.*, feed_menu.menu_name, feed_menu.menu_calorie, Profile.Profile_img_src
    FROM feeds 
    JOIN feed_menu ON feeds.feed_id = feed_menu.feed_id 
    JOIN Profile ON feeds.user_id = Profile.user_id  
    ORDER BY feeds.feed_date DESC;`;

    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error('피드 데이터 가져오기 오류:', error);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }

        const feeds = results.map(row => ({
            feed_id: row.feed_id,
            feed_date: row.feed_date,
            feed_user: row.user_id,
            category: row.category,
            menuList: [{ name: row.menu_name, calories: row.menu_calorie }],
            content: row.content,
            img_src: row.img_src,
            profile_img_src: row.Profile_img_src, 
            comments: []
        }));

        res.json({ success: true, feeds });
    });
});

// 히스토리 가져오기 API
app.get('/api/history', (req, res) => {
    const userId = req.session.userId; // 세션에서 userId 가져오기
    if (!userId) {
        return res.status(401).json({ success: false, message: '로그인 세션이 만료되었습니다.' });
    }
    
    const query = `
    SELECT feeds.*, feed_menu.menu_name, feed_menu.menu_calorie, Profile.Profile_img_src
    FROM feeds 
    JOIN feed_menu ON feeds.feed_id = feed_menu.feed_id 
    JOIN Profile ON feeds.user_id = Profile.user_id
    WHERE feeds.user_id = ?  
    ORDER BY feeds.feed_date DESC;`;

    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error('피드 데이터 가져오기 오류:', error);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }

        const feeds = results.map(row => ({
            feed_id: row.feed_id,
            feed_date: row.feed_date,
            feed_user: row.user_id,
            category: row.category,
            menuList: [{ name: row.menu_name, calories: row.menu_calorie }],
            content: row.content,
            img_src: row.img_src,
            profile_img_src: row.Profile_img_src, 
            comments: []
        }));

        res.json({ success: true, feeds });
    });
});
// 댓글 추가 API
app.post('/api/comments', (req, res) => {
    const { feedId, comment } = req.body; // 이미지 URL은 추가하지 않음

    const query = 'INSERT INTO Feed_comments (feed_id, user_id, comments_text) VALUES (?, ?, ?)';
    
    // 데이터베이스에 데이터 삽입
    connection.query(query, [feedId, req.session.userId, comment], (error, results) => {
        if (error) {
            console.error('댓글 추가 오류:', error);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }
        res.json({ success: true, message: '댓글이 추가되었습니다.' });
    });
});
// 댓글 가져오기 API
app.get('/api/comments/:feedId', (req, res) => {
    const feedId = req.params.feedId;

    const query = `
        SELECT c.user_id, c.comments_text, f.img_src 
        FROM Feed_comments c
        JOIN Feeds f ON c.feed_id = f.feed_id
        WHERE c.feed_id = ?;
    `;
    
    connection.query(query, [feedId], (err, results) => {
        if (err) {
            console.error('댓글 가져오기 오류:', err);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }

        const comments = results.map(row => ({
            user: row.user_id,
            comment: row.comments_text,
            //feedImage: row.img_src // 피드의 이미지 URL
        }));

        res.json({ success: true, comments });
    });
});

// 현재 사용자 ID 가져오기 API
app.get('/api/current_user', (req, res) => {
    if (req.session.userId) {
        res.json({ success: true, userId: req.session.userId });
    } else {
        res.status(401).json({ success: false, message: '사용자가 로그인하지 않았습니다.' });
    }
});

// 친구 목록 API
app.get('/api/friends', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: '로그인 세션이 만료되었습니다.' });
    }

    const query = 'SELECT followee_id FROM Follows WHERE follower_id = ?';
    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error('친구 목록 가져오기 오류:', error);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }

        const friendIds = results.map(friend => friend.followee_id);
        
        const userQuery = 'SELECT user_id, user_name FROM Users WHERE user_id IN (?)';
        connection.query(userQuery, [friendIds], (error, friends) => {
            if (error) {
                return res.status(500).json({ success: false, message: '서버 오류' });
            }
            res.json({ success: true, friends });
        });
    });
});
// 친구 추가 API
app.post('/api/friends/add', (req, res) => {
    const { followeeId } = req.body; // 추가할 친구의 ID
    const userId = req.session.userId; // 세션에서 사용자 ID 가져오기

    if (!userId) {
        return res.status(401).json({ success: false, message: '로그인 세션이 만료되었습니다.' });
    }

    const query = 'INSERT INTO Follows (follower_id, followee_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE followed_at = CURRENT_TIMESTAMP';
    
    connection.query(query, [userId, followeeId], (error, results) => {
        if (error) {
            console.error('친구 추가 오류:', error);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }
        res.json({ success: true, message: '친구 추가 성공' });
    });
});

// 친구 추천 API
app.get('/api/recommendations', (req, res) => {
    const userId = req.session.userId; // 세션에서 사용자 ID 가져오기

    if (!userId) {
        return res.status(401).json({ success: false, message: '로그인 세션이 만료되었습니다.' });
    }

    // 현재 사용자의 친구 목록 가져오기
    const friendQuery = 'SELECT followee_id FROM Follows WHERE follower_id = ?';
    connection.query(friendQuery, [userId], (error, friends) => {
        if (error) {
            console.error('친구 목록 가져오기 오류:', error);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }

        const friendIds = friends.map(friend => friend.followee_id);

        // 현재 사용자의 type 가져오기
        const userTypeQuery = 'SELECT type FROM User_sign WHERE user_id = ?';
        connection.query(userTypeQuery, [userId], (error, results) => {
            if (error || results.length === 0) {
                console.error('사용자 타입 가져오기 오류:', error);
                return res.status(500).json({ success: false, message: '서버 오류' });
            }

            const userType = results[0].type;

            // 같은 type을 가진 사용자 추천 쿼리 (user_name 제외)
            const recommendationQuery = `
            SELECT us.user_id, u.user_name 
            FROM User_sign us
            JOIN Users u ON us.user_id = u.user_id
            WHERE us.type = ? AND us.user_id NOT IN (?) AND us.user_id != ?
            LIMIT 3;
        `;

            // 친구 목록이 비어있을 경우
            if (friendIds.length === 0) {
                connection.query(recommendationQuery, [userType, '', userId], (error, recommendations) => {
                    if (error) {
                        console.error('추천 쿼리 오류:', error);
                        return res.status(500).json({ success: false, message: '서버 오류' });
                    }
                    res.json({ success: true, recommendations });
                });
            } else {
                connection.query(recommendationQuery, [userType, friendIds, userId], (error, recommendations) => {
                    if (error) {
                        console.error('추천 쿼리 오류:', error);
                        return res.status(500).json({ success: false, message: '서버 오류' });
                    }
                    res.json({ success: true, recommendations });
                });
            }
        });
    });
});

// 프로필 사진 업로드 API
app.post('/api/profile/upload', upload.single('image'), (req, res) => {
    const userId = req.session.userId; // 세션에서 사용자 ID 가져오기

    if (!userId) {
        return res.status(401).json({ success: false, message: '로그인 세션이 만료되었습니다.' });
    }

    const profileImgSrc = req.file ? req.file.path : null; // 이미지 파일 경로

    // 프로필 이미지 경로를 Profile 테이블에 저장
    const profileQuery = `
        INSERT INTO Profile (user_id, Profile_img_src) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE Profile_img_src = ?;
    `;

    connection.query(profileQuery, [userId, profileImgSrc, profileImgSrc], (error, results) => {
        if (error) {
            console.error('프로필 사진 저장 오류:', error);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }

        // Feeds 테이블의 profile_img_src 업데이트
        const feedsQuery = `
            UPDATE Feeds 
            SET Profile_img_src = ? 
            WHERE user_id = ?;
        `;

        connection.query(feedsQuery, [profileImgSrc, userId], (error, results) => {
            if (error) {
                console.error('피드 프로필 이미지 업데이트 오류:', error);
                return res.status(500).json({ success: false, message: '서버 오류' });
            }

            res.json({ success: true, message: '프로필 사진과 피드 이미지가 성공적으로 업데이트되었습니다.' });
        });
    });
});
// 사용자 프로필 정보를 가져오는 API
app.get('/api/profile', (req, res) => {
    const userId = req.session.userId; // 세션에서 사용자 ID 가져오기

    if (!userId) {
        return res.status(401).json({ success: false, message: '로그인 세션이 만료되었습니다.' });
    }

    const query = 'SELECT Profile_img_src FROM Profile WHERE user_id = ?';
    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error('프로필 정보 조회 오류:', error);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }

        if (results.length > 0) {
            res.json({ success: true, user_id: userId, Profile_img_src: results[0].Profile_img_src });
        } else {
            res.json({ success: false, message: '프로필 정보가 없습니다.' });
        }
    });
});
// 서버 시작
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
