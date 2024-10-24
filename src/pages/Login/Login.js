import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Login.css';


const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Logging in with:', { id, password }); // 로그 추가

    try {
        const response = await axios.post('http://localhost:3001/api/login', { id, password }, { withCredentials: true });
        console.log('Response:', response.data); // 서버 응답 로그 추가
        if (response.data.success) {
            //localStorage.setItem('userId', response.data.userId);
            navigate("/Home",{ state: { userId: response.data.userId } });
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error('Error during login:', error.response ? error.response.data : error.message);
        alert('로그인 중 오류가 발생했습니다.1');
    }
};

  return (
    <div className='Login-page'>
        <div className="Login-case">
            <div className='title'>Dietwith</div>
            
            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            className='login-box'
                            type="text"
                            placeholder="아이디"
                            value={id}
                            onChange={(event) => setId(event.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            className='login-box'
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <button className='login-button' 
                    type="submit" 
                    //onClick={() => {navigate("/Home");}}
                    >로그인</button>
                </form>
            </div>
            <div className='Go-Join-Id_Pass'>
                <div className="Join-option" id="Join" onClick={() => {navigate("/Join");}}>    
                    회원가입
                </div>
                <div className="ID_PassFind-option" id="ID_PassFind" onClick={() => {navigate("/ID_PassFind");}}>         
                    아이디/비밀번호 찾기
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;