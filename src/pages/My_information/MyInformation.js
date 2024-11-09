import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from "../../components/SideBar";
import styles from './MyInformation.module.css'; // 스타일 파일 경로
import { useNavigate } from "react-router-dom";

const MyInformation = () => {
    const [profileImg, setProfileImg] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [newWeight, setNewWeight] = useState("");
    const [weightRecords, setWeightRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUserId = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/current_user', { withCredentials: true });
            console.log('Fetched User ID:', response.data.userId); // 로그 추가
            return response.data.userId; // 로그인한 사용자 ID 반환
        } catch (error) {
            console.error('로그인 사용자 ID 가져오기 오류:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const userIdFromSession = await fetchUserId(); // 세션에서 사용자 ID 가져오기
            if (!userIdFromSession) {
                alert('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
                navigate('/'); // 로그인 페이지로 리다이렉트
                return;
            }
            setUserId(userIdFromSession); // userId 상태 설정

            
            try {
                const userResponse = await axios.get(`http://localhost:3001/api/user`, { withCredentials: true });
                console.log('User data fetched:', userResponse.data); // 로그 추가
                if (userResponse.data.success) {
                    setUserData(userResponse.data.user);
                }else {
                    console.error('사용자 데이터 가져오기 실패:', userResponse.data.message);
                }
    
                const weightResponse = await axios.get(`http://localhost:3001/api/user/${userIdFromSession}/weights`, { withCredentials: true });
                console.log('Weight records fetched:', weightResponse.data); // 로그 추가
                if (weightResponse.data.success) {
                    setWeightRecords(weightResponse.data.weights);
                }else {
                    console.error('사용자 데이터 가져오기 실패:', userResponse.data.message);
                }
            } catch (error) {
                console.error('데이터 가져오기 오류:', error);
                alert('사용자 데이터를 가져오는 데 문제가 발생했습니다. 다시 시도해 주세요.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserData();
    }, [navigate]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setProfileImg(file);
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

    const handleProfileSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('image', profileImg);

        try {
            const response = await axios.post('http://localhost:3001/api/profile/upload', formData, { withCredentials: true });
            if (response.data.success) {
                alert('프로필 사진이 업데이트되었습니다.');
                setImagePreview(null); // 미리보기 초기화
                navigate('/home');
            } else {
                alert('프로필 사진 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('프로필 사진 업로드 오류:', error);
            alert('서버 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
        }
    };

    const handleUserUpdate = async (event) => {
        event.preventDefault();
        // 세션에서 사용자 ID 가져오기
        const userId = await fetchUserId(); // 세션에서 사용자 ID를 가져오는 함수 호출
        if (!userId) {
            alert('사용자 정보를 가져올 수 없습니다.');
            return;
        }
        const updatedUserData = {
            user_id: userId, 
            user_gender: event.target.user_gender.value,
            user_height: parseFloat(event.target.user_height.value),
            user_purpose: event.target.user_purpose.value,
            user_like: event.target.user_like.value.split(',').map(item => item.trim()),
            user_hate: event.target.user_hate.value.split(',').map(item => item.trim()),
            user_activity: event.target.user_activity.value,
        };

        try {
            const response = await axios.put(`http://localhost:3001/api/user`, updatedUserData, { withCredentials: true });
            console.log('User update response:', response.data); // 로그 추가
            if (response.data.success) {
                alert('사용자 정보가 업데이트되었습니다.');
                setUserData(updatedUserData);
                navigate('/home');
            } else {
                alert('사용자 정보 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('사용자 정보 업데이트 오류:', error);
            alert('서버 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
        }
    };

    const handleWeightSubmit = async (e) => {
        e.preventDefault();
        const userId = await fetchUserId(); // fetchUserId 함수를 사용하여 세션에서 ID를 가져옵니다.
        if (!userId) {
            alert('사용자 정보를 가져올 수 없습니다.');
            return;
        }

        const recordDate = new Date().toISOString().split('T')[0]; // 오늘 날짜

        try {
            const response = await axios.post(`http://localhost:3001/api/user/weights`, {
                weight: newWeight,
                record_date: recordDate
            }, { withCredentials: true });
    
            console.log('Weight submit response:', response.data);
            if (response.data.success) {
                alert('체중 기록이 추가되었습니다.');
                setWeightRecords(prev => [...prev, { weight: newWeight, record_date: recordDate }]);
                setNewWeight(""); // 입력 필드 초기화
                navigate('/home');
            } else {
                console.error('체중 기록 추가 실패:', response.data.message);
            }
        } catch (error) {
            console.error('체중 기록 추가 오류:', error);
            alert('서버 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <>
        <SideBar />
        <div className="Join-container">
            <h1>내 정보</h1>
            <form onSubmit={handleUserUpdate}>
            <div>
                <h4>닉네임</h4>
                <p className='box'>{userId}</p>
            </div>
                <div>
                    <h4>성별</h4>
                    <select className='select' name="user_gender" defaultValue={userData.user_gender}>
                        <option value="M">남</option>
                        <option value="F">여</option>
                    </select>
                </div>
                <div>
                    <h4>키 (cm)</h4>
                    <input
                        className='box'
                        type="number"
                        placeholder="키"
                        name="user_height"
                        defaultValue={userData.user_height}
                        required
                    />
                </div>
                <div>
                    <h4>목표</h4>
                    <input
                        className='box'
                        type="text"
                        placeholder="목표 몸무게"
                        name="user_purpose"
                        defaultValue={userData.user_purpose}
                        required
                    />
                </div>
                <div>
                    <h4>좋아하는 것 (쉼표로 구분)</h4>  {/* 추가된 항목 */}
                    <input
                        className='box'
                        type="text"
                        placeholder="좋아하는 것 (예: 사과, 바나나)"
                        name="user_like"
                        defaultValue={userData.user_like ? userData.user_like.join(', ') : ""}
                    />
                </div>
                <div>
                    <h4>싫어하는 것 (쉼표로 구분)</h4>  {/* 추가된 항목 */}
                    <input
                        className='box'
                        type="text"
                        placeholder="싫어하는 것 (예: 오렌지, 파인애플)"
                        name="user_hate"
                        defaultValue={userData.user_hate ? userData.user_hate.join(', ') : ""}
                    />
                </div>
                <div>
                    <h4>활동량</h4>
                    <select className='select' name="user_activity" defaultValue={userData.user_activity}>
                        <option value="얌전">얌전</option>
                        <option value="보통">보통</option>
                        <option value="활발">활발</option>
                        </select>
                    </div>
                <div>
                    <button className='button' type="submit">정보 업데이트</button>
                </div>
            </form>
            <h2>프로필 사진 변경</h2>
            <form className={styles.uploadContainer} onSubmit={handleProfileSubmit}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className='box'
                    required
                />
                {imagePreview && (
                    <img className={styles.imagePreview} src={imagePreview} alt="Image Preview" />
                )}
                <button className='button' type="submit">프로필 적용</button>
            </form>
            <h2>체중 기록</h2>
            <form onSubmit={handleWeightSubmit}>
                <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder={weightRecords.length > 0 ? `${weightRecords[0].weight} kg` : "체중 입력 (kg)"} // DB에서 가져온 체중을 placeholder로 설정
                className='box'
                required
            />
                <button className='button' type="submit">정보 업데이트</button>
            </form>
        </div>
        </>
    );
};

export default MyInformation;
