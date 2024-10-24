import React from "react";
import styles from './Feed.module.css';
import Profile from "./Profile";
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
  return date.toLocaleString('ko-KR', options).replace(',', ''); // 'ko-KR'은 한국어 형식
};

export default function Feed({ feedData }) {
    const { feed_date, feed_user, category, menuList, content, img_src, profile_img_src } = feedData;

    const imageUrl = img_src ? `http://localhost:3001/${img_src.replace(/\\/g, '/')}` : '';
    const profileImageUrl = profile_img_src ? `http://localhost:3001/${profile_img_src.replace(/\\/g, '/')}` : ''; // 프로필 이미지 URL 생성
    const formattedDate = formatDate(feed_date);

    return (
        <div className={styles.feedCase}>
            <div className={styles.feedInformContainer}>
                <div className={styles.feedInfrom}>
                    <div className={styles.profile}>
                        <div 
                            className={styles.profileImage} 
                            style={{ backgroundImage: `url(${profileImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        </div>
                        <div className={styles.profileName}>{feed_user}</div>
                    </div>
                    <div className={styles.feedDate}>{formattedDate}</div>
                </div>
                <div className={styles.feedText}>
                    <h2>{category}</h2>
                    <div className={styles.feedMenuList}>
                        {menuList.length > 0 ? (
                            menuList.map((r, index) => (
                                <li key={index} className={styles.feedMenu}>{r.name} ({r.calories} kcal)</li>
                            ))
                        ) : (
                            <li className={styles.feedMenu}>메뉴가 없습니다.</li>
                        )}
                    </div>
                    <div className={styles.feedContent}>{content}</div>
                </div>
            </div>
            <div className={styles.feedImg}>
                {imageUrl && (
                    <img src={imageUrl} alt="피드 이미지" />
                )}
            </div>
        </div>
    );
}

// export default function Feed() {

//     return (
//         <div className="feed-case">

//             <div className="feed-inform-container">
//                 <div className="feed-infrom">
//                     <Profile/>
//                 </div>
//                 <div className="feed-text"> 
//                     <h2>카테고리</h2>
//                     <li>내용</li>
//                 </div>
//             </div>

//             <div className="feed-img">
//                 <h1>image</h1>
//             </div>
//         </div>



//     )
// }