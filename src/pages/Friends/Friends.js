import React from "react";
import {useState, useEffect } from "react";
import axios from 'axios';
import SideBar from "../../components/SideBar";
import styles from "./Friends.module.css"

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [friendRecommendations, setFriendRecommendations] = useState([]);
    
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get(''); // 실제 API 엔드포인트
                setFriends(response.data);
            } catch (error) {
                console.error('친구 목록을 가져오는데 실패했습니다:', error);
            }
        };

        const fetchFriendRecommendations = async () => {
            try {
                const response = await axios.get(''); // 실제 API 엔드포인트
                setFriendRecommendations(response.data);
            } catch (error) {
                console.error('친구 추천 데이터를 가져오는데 실패했습니다:', error);
            }
        };

        fetchFriends();
        fetchFriendRecommendations();
    }, []);

    return(
        <>
        <SideBar/>
        <div className={styles.page}>
                <div className={styles.friendsContainer}>
                    <h4>친구 목록</h4>
                    <div className={styles.friendList}>
                        {friends.length > 0 ? (
                            friends.map((friend, index) => (
                                <div key={index} className={styles.friendItem}>
                                    <span>{friend.name}</span>
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
                                    <span>{friend.name}</span>
                                </div>
                            ))
                        ) : (
                            <p>추천할 친구가 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Friends;