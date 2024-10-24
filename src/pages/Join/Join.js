import React, { useState } from 'react';
import './Join.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Join = () => {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('set');
  const [isIdValid, setIsIdValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);


  const handleCheckIdDuplicate = async () => {
    try {
        const response = await axios.post('http://localhost:3001/api/check-duplicate/id', {
            id,
        });

        if (response.data.success) {
            setIsIdValid(!response.data.isDuplicate);
            alert(response.data.isDuplicate ? response.data.message : '사용 가능한 아이디입니다.');
        }
    } catch (error) {
        console.error('아이디 중복 확인 중 오류 발생:', error);
        alert('아이디 중복 확인 중 오류가 발생했습니다.');
    }
};

const handleCheckEmailDuplicate = async () => {
    try {
        const response = await axios.post('http://localhost:3001/api/check-duplicate/email', {
            email,
        });

        if (response.data.success) {
            setIsEmailValid(!response.data.isDuplicate);
            alert(response.data.isDuplicate ? response.data.message : '사용 가능한 이메일입니다.');
        }
    } catch (error) {
        console.error('이메일 중복 확인 중 오류 발생:', error);
        alert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
};

const handleCheckNameDuplicate = async () => {
    try {
        const response = await axios.post('http://localhost:3001/api/check-duplicate/name', {
            name,
        });

        if (response.data.success) {
            setIsNameValid(!response.data.isDuplicate);
            alert(response.data.isDuplicate ? response.data.message : '사용 가능한 이름입니다.');
        }
    } catch (error) {
        console.error('이름 중복 확인 중 오류 발생:', error);
        alert('이름 중복 확인 중 오류가 발생했습니다.');
    }
};

const handleSubmit = async (event) => {
    event.preventDefault();

    if (type === 'set') {
        alert('목표를 설정해주세요.');
        return;
    }
    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }
    if (!isIdValid || !isEmailValid || !isNameValid) {
        alert('ID, 이메일, 이름 중복 확인을 해주세요.');
        return;
    }

    try {
        const response = await axios.post('http://localhost:3001/api/register', {
            id,
            password,
            name,
            email,
            type,
        });

        if (response.data.success) {
            alert(response.data.message);
            navigate("/"); // 회원가입 후 로그인 페이지로 이동
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
        alert('회원가입 중 오류가 발생했습니다.');
    }
};

     return (
        <div className="Join-container">
            <h1>회원가입</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <h4>아이디</h4>
                    <input
                        className='box'
                        type="text"
                        placeholder="아이디"
                        value={id}
                        onChange={(event) => setId(event.target.value)}
                        required
                    />
                    <button type="button" className="check-duplicate-button" onClick={handleCheckIdDuplicate}>
                        중복 확인
                    </button>
                </div>
                <div>
                    <h4>비밀번호</h4>
                    <input
                        className='box'
                        type="password"
                        style={{width: "440px"}}
                        placeholder="비밀번호"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <h4>비밀번호 확인</h4>
                    <input
                        className='box'
                        type="password"
                        style={{width: "440px"}}
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <h4>이름</h4>
                    <input
                        className='box'
                        type="text"
                        placeholder="이름"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                    <button type="button" className="check-duplicate-button" onClick={handleCheckNameDuplicate}>
                        중복 확인
                    </button>
                </div>
                <div>
                    <h4>이메일</h4>
                    <input
                        className='box'
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <button type="button" className="check-duplicate-button" onClick={handleCheckEmailDuplicate}>
                        중복 확인
                    </button>
                </div>
                <div>
                    <h4>목표 설정</h4>
                    <select className='select' style={{width: "440px"}} value={type} onChange={(event) => setType(event.target.value)}>
                        <option value="set">목표 설정</option>
                        <option value="다이어트">다이어트</option>
                        <option value="식단 관리">식단 관리</option>
                        <option value="식습관">식습관 개선</option>
                        <option value="기타">기타</option>
                    </select>
                </div>
                <div>
                    <button className='button' style={{width: "440px"}} type="submit">회원가입</button>
                </div>
            </form>
        </div>
    );
};

export default Join;