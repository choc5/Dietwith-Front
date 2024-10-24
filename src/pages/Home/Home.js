import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "../../components/SideBar";
import Feed from "../../components/Feed";
import Modal from "../../components/Modal";
import styles from './Home.module.css';


const Home = () => {
    const [feeds, setFeeds] = useState([]);
    const [selectedFeed, setSelectedFeed] = useState(null);

    // 피드 데이터를 가져오는 함수
    const fetchFeeds = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/feed', { withCredentials: true });
            console.log('피드 응답:', response.data);
            if (response.data.success) {
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
        fetchFeeds();
        const intervalId = setInterval(fetchFeeds, 60 * 1000); 
        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 클리어
    }, []);

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
    );
};

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
