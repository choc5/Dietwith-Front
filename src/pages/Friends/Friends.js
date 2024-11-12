import React, { useState, useEffect } from "react";
import axios from 'axios';
import SideBar from "../../components/SideBar";
import Feed from "../../components/Feed"; // 피드 컴포넌트
import styles from "./Friends.module.css"; // CSS 모듈 import

const Friends = () => {
    const [friends, setFriends] = useState([]); // 친구 목록 상태
    const [friendRecommendations, setFriendRecommendations] = useState([]); // 친구 추천 목록 상태
    const [feeds, setFeeds] = useState([]); // 피드 상태
    const [selectedFriendId, setSelectedFriendId] = useState(null); // 선택된 친구 ID 상태

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/current_user', { withCredentials: true });
                if (response.data.success) {
                    await fetchFriends(); // 친구 목록 가져오기
                    await fetchFriendRecommendations(); // 친구 추천 목록 가져오기
                } else {
                    console.error('사용자 정보를 가져오는 데 실패했습니다:', response.data.message);
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/friends', { withCredentials: true });
            if (response.data.success) {
                setFriends(response.data.friends); // 친구 목록 상태 업데이트
            }
        } catch (error) {
            console.error('친구 목록을 가져오는데 실패했습니다:', error);
        }
    };

    const fetchFriendRecommendations = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/recommendations', { withCredentials: true });
            if (response.data.success) {
                setFriendRecommendations(response.data.recommendations); // 추천 목록 상태 업데이트
            }
        } catch (error) {
            console.error('친구 추천 데이터를 가져오는 데 실패했습니다:', error);
        }
    };

    const addFriend = async (friendId) => {
        try {
            const response = await axios.post('http://localhost:3001/api/friends/add', { followeeId: friendId }, { withCredentials: true });
            if (response.data.success) {
                alert('친구 추가 성공!');
                await fetchFriends(); // 친구 목록 갱신
                setFriendRecommendations(friendRecommendations.filter(friend => friend.user_id !== friendId)); // 추천 목록에서 추가된 친구 제거
            } else {
                alert('친구 추가에 실패했습니다: ' + response.data.message);
            }
        } catch (error) {
            console.error('친구 추가에 실패했습니다:', error);
            alert('오류: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const removeFriend = async (friendId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/api/friends/remove`, { data: { followeeId: friendId }, withCredentials: true });
            if (response.data.success) {
                alert(`${friendId}님을 친구 목록에서 삭제했습니다.`);
                setFriends(friends.filter(friend => friend.followee_id !== friendId)); // 친구 목록에서 삭제
                if (selectedFriendId === friendId) {
                    setSelectedFriendId(null); // 선택 초기화
                    setFeeds([]); // 피드 초기화
                }
                await fetchFriendRecommendations(); // 추천 목록 업데이트
            } else {
                alert('친구 삭제에 실패했습니다: ' + response.data.message);
            }
        } catch (error) {
            console.error('친구 삭제에 실패했습니다:', error);
            alert('오류 발생');
        }
    };

    const fetchFeedsByFriend = async (friendId) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/friends/id?userId=${friendId}`, { withCredentials: true });
            if (response.data.success) {
                setFeeds(response.data.feeds);
                setSelectedFriendId(friendId); // 선택된 친구 ID 설정
            } else {
                console.error('친구 피드 데이터를 가져오는 데 실패했습니다:', response.data.message);
                setFeeds([]); // 실패 시 피드 초기화
            }
        } catch (error) {
            console.error('친구 피드를 가져오는데 실패했습니다:', error);
            setFeeds([]); // 오류 발생 시 피드 초기화
        }
    };

    const handleFriendClick = (friendId) => {
        fetchFeedsByFriend(friendId); // 클릭된 친구의 피드 가져오기
    };

    return (
        <>
            <SideBar />
            <div className={styles.page}>
                <div className={styles.friendsContainer}>
                    <h4>친구 목록</h4>
                    <div className={styles.friendList}>
                        {friends.length > 0 ? (
                            friends.map((friend) => {
                                const { followee_id, user_name, Profile_img_src } = friend; // 구조 분해 할당
                                const profileImageUrl = Profile_img_src ? `http://localhost:3001/${Profile_img_src.replace(/\\/g, '/')}` : 'default-profile.png'; // 프로필 이미지 URL 생성

                                return (
                                    <div key={followee_id} className={styles.friendItem} onClick={() => handleFriendClick(followee_id)}>
                                        <div className={styles.friendInfo}>
                                            <div 
                                                className={styles.profileImage} 
                                                style={{ 
                                                    backgroundImage: `url(${profileImageUrl})`, 
                                                    backgroundSize: 'cover', 
                                                    backgroundPosition: 'center' 
                                                }} 
                                            />
                                            <span className={styles.friendName}>{user_name}</span>
                                        </div>
                                        <button className={styles.removeButton} onClick={(e) => { e.stopPropagation(); removeFriend(followee_id); }}>친구 삭제</button>
                                    </div>
                                );
                            })
                        ) : (
                            <p>친구가 없습니다.</p>
                        )}
                    </div>
                    <h4>친구 추천 목록</h4>
                    <div className={styles.friendRecommendations}>
                        {friendRecommendations.length > 0 ? (
                            friendRecommendations.map((friend) => {
                                const { user_id, user_name, Profile_img_src } = friend; // 구조 분해 할당
                                const profileImageUrl = Profile_img_src ? `http://localhost:3001/${Profile_img_src.replace(/\\/g, '/')}` : 'default-profile.png'; // 프로필 이미지 URL 생성

                                return (
                                    <div key={user_id} className={styles.recommendationItem} onClick={() => handleFriendClick(user_id)}>
                                        <div className={styles.friendInfo}>
                                            <div 
                                                className={styles.profileImage} 
                                                style={{ 
                                                    backgroundImage: `url(${profileImageUrl})`, 
                                                    backgroundSize: 'cover', 
                                                    backgroundPosition: 'center' 
                                                }} 
                                            />
                                            <span className={styles.friendName}>{user_name}</span>
                                        </div>
                                        <button className={styles.addButton} onClick={(e) => { e.stopPropagation(); addFriend(user_id); }}>친구 추가</button>
                                    </div>
                                );
                            })
                        ) : (
                            <p>추천할 친구가 없습니다.</p>
                        )}
                    </div>
                </div>

                {selectedFriendId && (
                    <div className={styles.feedsContainer}>
                        <h4>{selectedFriendId}의 피드</h4>
                        {feeds.length > 0 ? (
                            feeds.map(feed => (
                                <Feed key={feed.feed_id} feedData={feed} />
                            ))
                        ) : (
                            <p>피드가 없습니다.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Friends;