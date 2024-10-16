import React, { useState } from 'react';
import './ID_PassFind.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ID_PassFind = () => {
  const navigate = useNavigate();
  
  const [type, setType] = useState('id'); // 'id' 또는 'pw'
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/find', {
        type,
        email,
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/"); // 성공 후 홈으로 이동
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error during ID/password find:', error);
      alert('아이디/비밀번호 찾기 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
    <div className='BackBtn' onClick={() => {navigate("/");}}>
        <svg viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.99131 20.9496L2.49566 23.5449L0 20.9496L2.49566 18.3543L4.99131 20.9496ZM22.6409 65C21.7047 65 20.8069 64.6133 20.1449 63.9248C19.4829 63.2364 19.111 62.3027 19.111 61.3291C19.111 60.3556 19.4829 59.4219 20.1449 58.7334C20.8069 58.045 21.7047 57.6583 22.6409 57.6583V65ZM20.1453 41.8992L2.49566 23.5449L7.48697 18.3543L25.1366 36.7086L20.1453 41.8992ZM2.49566 18.3543L20.1453 0L25.1366 5.1906L7.48697 23.5449L2.49566 18.3543ZM4.99131 17.2788H42.0555V24.6205H4.99131V17.2788ZM42.0555 65H22.6409V57.6583H42.0555V65ZM65 41.1394C65 47.4676 62.5826 53.5366 58.2797 58.0114C53.9768 62.4861 48.1408 65 42.0555 65V57.6583C44.1415 57.6583 46.2071 57.231 48.1343 56.4008C50.0615 55.5707 51.8126 54.3539 53.2876 52.82C54.7627 51.2861 55.9327 49.465 56.731 47.4609C57.5293 45.4567 57.9402 43.3087 57.9402 41.1394H65ZM42.0555 17.2788C48.1408 17.2788 53.9768 19.7926 58.2797 24.2674C62.5826 28.7421 65 34.8111 65 41.1394H57.9402C57.9402 38.9701 57.5293 36.822 56.731 34.8179C55.9327 32.8137 54.7627 30.9927 53.2876 29.4588C51.8126 27.9248 50.0615 26.7081 48.1343 25.8779C46.2071 25.0478 44.1415 24.6205 42.0555 24.6205V17.2788Z" fill="black"/>
        </svg>
      </div>

    <div className="finder-container">
      <h1>아이디/비밀번호 찾기</h1>

      <form onSubmit={handleSubmit}>
        <select className='select' value={type} onChange={(event) => setType(event.target.value)}>
          <option value='id'>아이디 찾기</option>
          <option value='pw'>비밀번호 찾기</option>
        </select>
        <div >
        <h4>이메일을 입력해 주세요</h4>
        <input
        className='box'
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        </div>
        <button className='button' type="submit">찾기</button>
      </form>
    </div>
    </>
  );
};

export default ID_PassFind;