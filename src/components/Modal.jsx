import React from 'react';
import styles from './Modal.module.css';
// import Feed from './Feed';
import { useEffect, useState } from 'react';


const Modal = ({ feed, onClose, onUpdateComments }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(feed.comments || []);

    const handleAddComment = () => {
        const newComment = { user: '올라운더', comment   : comment }; //임시 이름
        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        setComment(''); // 입력 초기화
        onUpdateComments(feed.feed_id, updatedComments); // 부모 컴포넌트에 업데이트된 댓글 목록 전달
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {/* <Feed feedData={{ ...feed, comments }} /> */}
                <div className={styles.currentFeed}>
                    <img src={feed.imageSrc} className={styles.currentFeedImage}></img>
                    <div className={styles.currentFeedContent}>
                        <h4>{feed.category}</h4>
                        <div className={styles.currentFeedMenuList}>
                            {feed.menuList.map((r, index) => (
                            <li key={index} className={styles.currentFeedMenu}>{r.name} {r.calories}</li>
                        ))}
                        </div>
                    </div>

                </div>
                <div className={styles.commentsContainer}>
                    <h4>댓글</h4>
                    <ul className={styles.commentsList}>
                        {comments.map((r, index) => (
                            <div key={index} className={styles.feedComment}>
                                {r.user} : {r.comment}
                            </div>
                        ))}
                    </ul>
                    <div className={styles.addCommentSection}>
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="댓글을 입력하세요."
                        />
                        <button onClick={handleAddComment}>등록</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;   

// const Modal = ({ feed, onClose }) => {
//     const [comment, setComment] = useState('');
//     const [comments, setComments] = useState(feed.comment || []);

//     const handleAddComment = (e) => {
//         const newComment = { user: 'currentUser', content: comment }; // 현재 사용자 이름을 'currentUser'로 설정, 실제 앱에서는 로그인한 사용자 정보를 사용해야 함
//         const updatedComments = [...comments, newComment];
//         setComments(updatedComments);
//         setComment(''); // 입력 필드 초기화
//     };

//     return (
//     <div className={styles.modalOverlay} onClick={onClose}>
//       <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//         <Feed feedData={feed} />
//         <div className={styles.commentContainer}>
//             <h3>댓글</h3>
//             <ul className={styles.commentList}>
//                 {feed.comments.map((r, index) => (
//                 <li key={index}>{r.user}: {r.content}</li>
//                 ))}
//             </ul>
//             <div className={styles.addCommentSection}>
//               <input
//                 type="text"
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 placeholder="댓글을 입력하세요..."
//               />
//               <button onClick={handleAddComment}>등록</button>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;
