import React from "react";
import { useState } from "react";
import SideBar from "../../components/SideBar";
import Feed from "../../components/Feed";
import Modal from "../../components/Modal";
import styles from './Home.module.css';

const Home = () => {
    const [feeds, setFeeds] = useState([
        {
            feed_id: 'user0987_000004',
            feed_date: '2024/06/01',
            feed_user: '우주',
            category: '저녁',
            menuList: [{ name: '라면', calories: 450 }, {name: '아이스 아메리카노'}],
            content: '건강하게 먹어야 하는데..',
            comments: [{ user: '입긴편', comment: '부실하다.. 멸치 탈출하려면 탄수화물이 필요함.' }, { user: '우주', comment: '내 점심인줄' }],
            imageSrc: "image.jpg",
        },
        {
            feed_id: 'user4756_000204',
            feed_date: '2024/05/30',
            feed_user: '푸드파이터 물개',
            category: '점심',
            menuList: [{ name: '피자', calories: 1100 }, {name: '치킨', calories: 1800}, {name: '치즈볼', calories: 450}, {name: '콜라', calories: 294}],
            content: '오늘은 요정도.',
            comments: [{ user: '입긴편', comment: '언제 한 번 같이 식당 가시죠' }, { user: '우주', comment: '!!!!!!!' }],
            imageSrc: "image.jpg",
        },
        {
            feed_id: 'user7777_000077',
            feed_date: '2024/05/30',
            feed_user: '관리하는 고양이',
            category: '아침',
            menuList: [{ name: '삶은 계란', calories: 90 }, {name: '아이스 아메리카노', calories:55}],
            content: '',
            comments: [{ user: '고양이좋아', comment: '꺄' }, { user: '푸드파이터 물개', comment: '엥? 이렇게 먹고 사람이 살아?' }],
            imageSrc: "image.jpg",
        },
        {
            feed_id: 'user1987_001987',
            feed_date: '2024/05/28',
            feed_user: '힘찬 강아지',
            category: '간식',
            menuList: [{ name: '햄버거', calories: 620 }],
            content: '우리 모두 잘먹읍시다! 파이팅!',
            comments: [{ user: '우주', comment: '파이팅..' }],
            imageSrc: "image.jpg",
        },
    ]);
    const [selectedFeed, setSelectedFeed] = useState(null);

   

    const handleOpenModal = (feed) => {
        setSelectedFeed(feed);
    };

    const handleCloseModal = () => {
        setSelectedFeed(null);
    };

    const handleUpdateComments = (feedId, updatedComments) => {
        setFeeds(feeds.map(feed => feed.feed_id === feedId ? { ...feed, comments: updatedComments } : feed));
    };

    return (
        <>
        <SideBar />
        <div className={styles.page}>           
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

export default Home;



// const Home = () => {
//   const [selectedFeed, setSelectedFeed] = useState(null);

//   const handleFeedClick = (feed) => {
//     setSelectedFeed(feed);
//   };

//   const handleCloseModal = () => {
//     setSelectedFeed(null);
//   };

//   const dummyFeeds = [
//     {
//       feed_id: 'user1_123',
//       feed_user: 'user1',
//       category: 'breakfast',
//       menuList: [{ name: 'Eggs', calories: 200 }, { name: 'Bacon', calories: 150 }],
//       content: 'Delicious breakfast!',
//       comments: [{ user: 'user2', comment: 'Looks yummy!' },
//         {user: 'user3', comment: "how disgusted"},
//       ]
//     },
//   ];

//   return (
//     <>
//       <SideBar />
//       <div className={styles.page}>
//         <div className={styles.feeds}>
//           {dummyFeeds.map((feed) => (
//             <div key={feed.feed_id} onClick={() => handleFeedClick(feed)}>
//               <Feed feedData={feed} />
//             </div>
//           ))}
//         </div>
//       </div>
//       {selectedFeed && (
//         <Modal feed={selectedFeed} onClose={handleCloseModal} />
//       )}
//     </>
//   );
// };

// export default Home;


// const Home = () => {
//     return(
//         <>
//         <SideBar/>
//         <div className={styles.page}>
//             <div className={styles.feeds}>
//                 <Feed/>
//                 <Feed/>
//                 <Feed/>
//             </div>
//         </div>
//         </>
//     )
// }

// export default Home;
