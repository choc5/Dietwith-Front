import React from 'react';
import styles from './Modal.module.css';
// import Feed from './Feed';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Modal = ({ feed, onClose, onUpdateComments }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // 현재 사용자 ID 가져오기 (로그인한 사용자)
        const fetchUserId = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/current_user', { withCredentials: true });
                if (response.data.success) {
                    setUserId(response.data.userId);
                }
            } catch (error) {
                console.error('사용자 정보 가져오기 오류:', error);
            }
        };

        // 댓글 가져오기
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/comments/${feed.feed_id}`, { withCredentials: true });
                if (response.data.success) {
                    setComments(response.data.comments);
                }
            } catch (error) {
                console.error('댓글 가져오기 오류:', error);
            }
        };

        fetchUserId();
        fetchComments(); 
    }, [feed]);

    const handleAddComment = async () => {
        if (!comment.trim()) {
            alert('댓글을 입력하세요.');
            return;
        }

        const imageUrl = ''; // 필요에 따라 이미지 URL을 설정

        try {
            const response = await axios.post('http://localhost:3001/api/comments', {
                feedId: feed.feed_id,
                comment: comment,
                imageUrl: imageUrl // 추가된 이미지 URL
            }, { withCredentials: true });

            if (response.data.success) {
                const newComment = { user: userId, comment, imgUrl: imageUrl }; // 이미지 URL 포함
                const updatedComments = [...comments, newComment];
                setComments(updatedComments);
                setComment(''); // 입력 초기화
                onUpdateComments(feed.feed_id, updatedComments);
            } else {
                console.error('댓글 추가 실패:', response.data.message);
            }
        } catch (error) {
            console.error('오류 발생:', error);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.currentFeed}>
                    <img 
                        src={feed.img_src ? `http://localhost:3001/${feed.img_src.replace(/\\/g, '/')}` : ''}
                        className={styles.currentFeedImage} 
                        
                    />
                    <div className={styles.currentFeedContent}>
                        <h4>{feed.category}</h4>
                        <div className={styles.currentFeedMenuList}>
                            {feed.menuList.map((r, index) => (
                                <li key={index} className={styles.currentFeedMenu}>{r.name} {r.calories} kcal</li>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.commentsContainer}>
                    <div className={styles.commentsContainer}>  
                        <h4>댓글</h4>
                        <ul className={styles.commentsList}>
                            {comments.map((r, index) => (
                                <div key={index} className={styles.feedComment}>
                                    {r.user} : {r.comment}
                                    {r.imgUrl && <img src={`http://localhost:3001/${r.imgUrl.replace(/\\/g, '/')}`} alt="댓글 이미지" className={styles.commentImage} />}
                                    {r.feedImage && <img src={`http://localhost:3001/${r.feedImage.replace(/\\/g, '/')}`} alt="피드 이미지" className={styles.feedImage} />}
                                </div>
                            ))}
                        </ul>
                    </div>
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
