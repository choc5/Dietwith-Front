import React, { useState, useEffect } from "react";
import axios from 'axios';
import SideBar from "../../components/SideBar";
import styles from "./Friends.module.css";
const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [friendRecommendations, setFriendRecommendations] = useState([]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/current_user', { withCredentials: true });
                if (response.data.success) {
                    const userId = response.data.userId;
                    fetchFriends(userId);
                    fetchFriendRecommendations(userId);
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
                setFriends(response.data.friends);
            }
        } catch (error) {
            console.error('친구 목록을 가져오는데 실패했습니다:', error);
            // 로그인 페이지로 리다이렉션
            if (error.response && error.response.status === 401) {
                alert('로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
                // 여기서 로그인 페이지로 이동하는 로직을 추가할 수 있습니다.
            }
        }
    };
    const fetchFriendRecommendations = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/recommendations', { withCredentials: true }); // 친구 추천 API 호출
            if (response.data.success) {
                setFriendRecommendations(response.data.recommendations);
            } else {
                console.error('친구 추천 데이터를 가져오는데 실패했습니다:', response.data.message);
            }
        } catch (error) {
            console.error('친구 추천 데이터를 가져오는데 실패했습니다:', error);
        }
    };
    const addFriend = async (friendId) => {
        try {
            const response = await axios.post('http://localhost:3001/api/friends/add', { followeeId: friendId }, { withCredentials: true });
            if (response.data.success) {
                alert(`${friendId}님을 친구 목록에 추가했습니다.`);
                // 추천 목록에서 해당 친구 제거
                setFriendRecommendations(friendRecommendations.filter(friend => friend.user_id !== friendId));
                // 친구 목록 갱신
                fetchFriends();
            }
        } catch (error) {
            console.error('친구 추가에 실패했습니다:', error);
        }
    };
    return (
        <>
            <SideBar />
            <div className={styles.page}>
                <div className={styles.friendsContainer}>
                    <h4>친구 목록</h4>
                    <div className={styles.friendList}>
                        {friends.length > 0 ? (
                            friends.map((friend, index) => (
                                <div key={index} className={styles.friendItem}>
                                    <span>{friend.user_name}</span>
                                </div>
                            ))
                        ) : (
                            <p>친구가 없습니다.</p>
                        )}
                    </div>
                    <h4>친구 추천 목록</h4>
                    <div className={styles.friendRecommendations}>
                        {friendRecommendations.length > 0 ? (
                            friendRecommendations.map((friend, index) => (
                                <div key={index} className={styles.recommendationItem}>
                                    <span>{friend.user_name}</span>
                                    <button onClick={() => addFriend(friend.user_id)}>친구 추가</button>
                                </div>
                            ))
                        ) : (
                            <p>추천할 친구가 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Friends;