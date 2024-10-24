import React from "react";
import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import Feed from "../../components/Feed";
import styles from './History.module.css';
import Modal from "../../components/Modal";
import axios from "axios";
const History = () => {
    const [feeds, setFeeds] = useState([]);

    // 사용자의 피드를 가져오는 함수
    const fetchUserFeeds = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/history', { withCredentials: true });

            if (response.data.success) {
                console.log('피드 데이터:', response.data.feeds); 
                setFeeds(response.data.feeds);
            } else {
                console.error('피드 가져오기 실패:', response.data.message);
            }
        } catch (error) {
            if (error.response) {
                console.error('서버 응답 오류:', error.response.data);
            } else if (error.request) {
                console.error('요청이 이루어졌으나 응답이 없음:', error.request);
            } else {
                console.error('오류 발생:', error.message);
            }
        }
    };

    useEffect(() => {
        // 컴포넌트가 마운트될 때 사용자의 피드를 가져옵니다.
        fetchUserFeeds();
    }, []);

    const [selectedFeed, setSelectedFeed] = useState(null);

    // const handleFeedClick = (feed) => {
    //     setSelectedFeed(feed);
    // };

    const handleOpenModal = (feed) => {
        setSelectedFeed(feed);
    };

    const handleCloseModal = () => {
        setSelectedFeed(null);
    };

    const handleUpdateComments = (feedId, updatedComments) => {
        setFeeds(feeds.map(feed => feed.feed_id === feedId ? { ...feed, comments: updatedComments } : feed));
    };

    return(
        <>
            <SideBar/>
            <div className={styles.page}>
                <div className={styles.title}>🍴 나의 기록 🍚</div>
                <div className={styles.feeds}>
                {feeds.map(feed => (
                    <div key={feed.feed_id} onClick={() => handleOpenModal(feed)}>
                        <Feed feedData={feed} />
                    </div>
                ))}
                {selectedFeed && (
                    <Modal
                        feed={selectedFeed}
                        onClose={handleCloseModal}
                        onUpdateComments={handleUpdateComments}
                    />
                )}
                </div>
            </div>
        </>
    )
}

export default History;
