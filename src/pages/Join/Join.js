// JavaScript source code
import React, { useState } from 'react';
import './Join.css';
import { useNavigate } from 'react-router-dom';


const Join = () => {
  const navigate = useNavigate();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('set');
  const handleSubmit = (event) => {
    event.preventDefault();

    if(type == 'set'){
        alert('목표를 설정해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }


  };

  return (
    <>    
      <div className='BackBtn' onClick={() => {navigate("/");}}>
        <svg viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.99131 20.9496L2.49566 23.5449L0 20.9496L2.49566 18.3543L4.99131 20.9496ZM22.6409 65C21.7047 65 20.8069 64.6133 20.1449 63.9248C19.4829 63.2364 19.111 62.3027 19.111 61.3291C19.111 60.3556 19.4829 59.4219 20.1449 58.7334C20.8069 58.045 21.7047 57.6583 22.6409 57.6583V65ZM20.1453 41.8992L2.49566 23.5449L7.48697 18.3543L25.1366 36.7086L20.1453 41.8992ZM2.49566 18.3543L20.1453 0L25.1366 5.1906L7.48697 23.5449L2.49566 18.3543ZM4.99131 17.2788H42.0555V24.6205H4.99131V17.2788ZM42.0555 65H22.6409V57.6583H42.0555V65ZM65 41.1394C65 47.4676 62.5826 53.5366 58.2797 58.0114C53.9768 62.4861 48.1408 65 42.0555 65V57.6583C44.1415 57.6583 46.2071 57.231 48.1343 56.4008C50.0615 55.5707 51.8126 54.3539 53.2876 52.82C54.7627 51.2861 55.9327 49.465 56.731 47.4609C57.5293 45.4567 57.9402 43.3087 57.9402 41.1394H65ZM42.0555 17.2788C48.1408 17.2788 53.9768 19.7926 58.2797 24.2674C62.5826 28.7421 65 34.8111 65 41.1394H57.9402C57.9402 38.9701 57.5293 36.822 56.731 34.8179C55.9327 32.8137 54.7627 30.9927 53.2876 29.4588C51.8126 27.9248 50.0615 26.7081 48.1343 25.8779C46.2071 25.0478 44.1415 24.6205 42.0555 24.6205V17.2788Z" fill="black"/>
        </svg>
      </div>

    <div className="Join-container">
      <h1>회원가입</h1>

      <form onSubmit={handleSubmit}>
        <div>
            <h4>아이디      </h4>
        <input
          className='box'
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(event) => setId(event.target.value)}
          required
        />
        </div>
        <div>
        <h4>비밀번호        </h4>
        <input
        className='box'
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        /></div>
        <div>
        <h4>비밀번호 확인   </h4>
        <input
        className='box'
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        /></div>
        <div>
        <h4>이름         </h4>
        <input
        className='box'
          type="text"
          placeholder="이름"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        /></div>
        <div>
        <h4>email        </h4>
        <input
        className='box'
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        /></div>
        <div>
        <h4>목표 설정    </h4>
        <select className='select' value={type} onChange={(event) => setType(event.target.value)}>
          <option value="set">목표 설정</option>
          <option value="set-a">다이어트</option>
          <option value="set-b">식단 관리</option>
          <option value="set-c">식습관 개선</option>
          <option value="set-d">기타</option>
        </select></div>
        <div>
        <button className='button' type="submit">회원가입</button>
        </div>
      </form>
    </div>
    </>

  );
};

export default Join;