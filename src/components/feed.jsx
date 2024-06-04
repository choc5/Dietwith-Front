import React from "react";
import styles from './Feed.module.css';
//import Profile from "./Profile";

export default function Feed({ feedData }) {
  const { feed_id, feed_date, feed_user, category, menuList, content, comments, imageSrc } = feedData;

  return (
    <div className={styles.feedCase}>
      <div className={styles.feedInformContainer}>
        <div className={styles.feedInform}>
            <div className={styles.profile}>
                <div className={styles.profileImage}></div>
                <div className={styles.profileName}>{feed_user}</div>
            </div>
            <div className={styles.feedDate}>{feed_date}</div>
        </div>
        <div className={styles.feedText}>
          <h2>{category}</h2>
            <div className={styles.feedMenuList}>
                {menuList.map((r, index) => (
                <li key={index} className={styles.feedMenu}>{r.name} ({r.calories} kcal)</li>
                ))}
            </div>
          <div className={styles.feedContent}>{content}</div>
        </div>
      </div>
      <div className={styles.feedImg}>
        <img src={imageSrc} alt="feed"/>
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