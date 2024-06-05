import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

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
                    onClick={() => {navigate("/Home");}}>로그인</button>
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