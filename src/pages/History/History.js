import React from "react";
import { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import Feed from "../../components/Feed";
import styles from './History.module.css';
import Modal from "../../components/Modal";

const History = () => {
    const [feeds, setFeeds] = useState([
        {
            feed_id: 'user1234_000021',
            feed_date: '2024/06/01',
            feed_user: '올라운더',
            category: '아침',
            menuList: [{ name: '삶은 계란', calories: 200 }, { name: '베이컨', calories: 150 }, {name: '보리차'}],
            content: '오랜만에 제대로 된 아침!',
            comments: [{ user: '입긴편', comment: '부실하다.. 탄수화물이 필요함.' }, { user: '입짧은편', comment: '푸짐하네!' }],
            imageSrc: "image.jpg",
        },
        {
            feed_id: 'user1234_000022',
            feed_date: '2024/05/29',
            feed_user: '올라운더',
            category: '점심',
            menuList: [{ name: '밥', calories: 340 }, { name: '차돌 된장찌개', calories: 560 }, {name: '계란말이', calories: 212}],
            content: '제 점심입니다. 근육을 붙이려고 하는데 어떤식으로 먹어야할까요?',
            comments: [{ user: '헬린이', comment: '단백질을 제대로 섭취하는 게 좋을 것 같음' }, { user: '운동싫어함', comment: '식단만 조절해도 살빠짐' }],
            imageSrc: "image.jpg",
        },
        {
            feed_id: 'user1234_000023',
            feed_date: '2024/05/27',
            feed_user: '올라운더',
            category: '간식',
            menuList: [{ name: '식혜'}, { name: '과자'}, {name: '구운계란'}],
            content: '오랜만에 제대로 된 아침!',
            comments: [],
            imageSrc: "image.jpg",
        },
    ]);

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
