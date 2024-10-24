import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/SideBar';
import styles from './MyInformation.module.css'; // 스타일 파일 경로
import { useNavigate } from "react-router-dom";

const MyInformation = () => {
    const [profileImg, setProfileImg] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setProfileImg(file);
        // 이미지 미리보기
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('image', profileImg);

        try {
            const response = await axios.post('http://localhost:3001/api/profile/upload', formData, { withCredentials: true });
            if (response.data.success) {
                alert('프로필 사진이 업데이트되었습니다.');
                navigate("/home");
            } else {
                alert('프로필 사진 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('프로필 사진 업로드 오류:', error);
            alert('서버 오류가 발생했습니다.');
        }
    };

    return (
           
            <div className={styles.JoinContainer}>
                <h1>프로필 사진 변경</h1>
                <form className={styles.uploadContainer} onSubmit={handleSubmit}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={styles.box}
                        required
                    />
                    {imagePreview && (
                        <img
                            className={styles.imagePreview}
                            src={imagePreview}
                            alt="Image Preview"
                        />
                    )}
                    <button type="submit" className={styles.button}>프로필 적용</button>
                </form>
            </div>
        
    );
};

export default MyInformation;