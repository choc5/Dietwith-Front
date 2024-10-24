import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./Profile.css";

export default function Profile() {
    const [userId, setUserId] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState(''); // 프로필 이미지 URL 상태
    const [sessionUserId, setSessionUserId] = useState(''); // 세션 사용자 ID 상태

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/profile', { withCredentials: true });
                if (response.data.success) {
                    setUserId(response.data.user_id);  // user_id를 설정
                    const profileImagePath = response.data.Profile_img_src.replace(/\\/g, '/'); // 백슬래시를 슬래시로 변경
                    setProfileImageUrl(`http://localhost:3001/${profileImagePath}`); // 프로필 이미지 URL 설정
                } else {
                    console.error('프로필 정보를 가져오는 데 실패했습니다:', response.data.message);
                    // 프로필 정보가 없을 경우 세션에서 사용자 ID 가져오기
                    fetchSessionUserId();
                    setProfileImageUrl('http://localhost:3001/path/to/default/profile_image.png'); // 기본 프로필 이미지 URL 설정
                }
            } catch (error) {
                console.error('프로필 정보를 가져오는 데 실패했습니다:', error);
                // 오류 발생 시 세션에서 사용자 ID 가져오기
                fetchSessionUserId();
                setProfileImageUrl('http://localhost:3001/path/to/default/profile_image.png'); // 기본 프로필 이미지 URL 설정
            }
        };

        const fetchSessionUserId = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/current_user', { withCredentials: true });
                if (response.data.success) {
                    setSessionUserId(response.data.userId); // 세션에서 사용자 ID 설정
                }
            } catch (error) {
                console.error('세션 사용자 ID를 가져오는 데 실패했습니다:', error);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="profile-presenter">
            {profileImageUrl ? (
                <div
                    className="profile-image"
                    style={{ backgroundImage: `url(${profileImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                ></div>
            ) : (
                <div
                    className="profile-image"
                    style={{ backgroundImage: `url(http://localhost:3001/path/to/default/profile_image.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                ></div>
            )}
            <div className="profile-name">{userId || sessionUserId || 'Unknown User'}</div> {/* 사용자 ID 출력 */}
        </div>
    );
}