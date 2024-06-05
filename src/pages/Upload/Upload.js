import React, { useState } from 'react';
import styles from './Upload.module.css';
import Sidebar from '../../components/SideBar'

const Upload = () => {
    const [type, setCategory] = useState('');
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState(''); // 칼로리 상태 추가
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [menuList, setMenuList] = useState([]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImage(null);
            setImagePreview('');
        }
    };

    const handleAddFood = () => {
        if (!foodName) {
            alert('음식 이름을 입력해주세요.');
            return;
        }
        const newFood = {
            id: Date.now(),
            name: foodName,
            calories, // 칼로리 정보 추가
            isChecked: false,
        };
        setMenuList([...menuList, newFood]);
        setFoodName('');
        setCalories(''); // 칼로리 입력값 초기화
    };

    const handleRemoveFood = (id) => {
        setMenuList(menuList.filter(item => item.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (type==="") {
            alert('식사 유형을 선택해주세요.');
            return;
        }
        if (menuList.length === 0) {
            alert('음식을 하나 이상 추가해주세요.');
            return;
        }
        console.log({ type, menuList, description, image });
        // 업로드 로직 구현 위치
        alert('업로드에 성공했습니다!');
        // 입력값 초기화
        setCategory('');
        setFoodName('');
        setCalories('');
        setDescription('');
        setImage(null);
        setImagePreview('');
        setMenuList([]);
    };

    return (
        <>
        <Sidebar />
        <div className={styles.page}>
            <div className={styles.uploadContainer}>
                <form className={styles.uploadForm} onSubmit={handleSubmit}>
                    <select className={styles.mealCategory} value={type} onChange={(event) => setCategory(event.target.value)}>
                        <option value="">식사 유형 선택</option>
                        <option value="아침">아침</option>
                        <option value="점심">점심</option>
                        <option value="저녁">저녁</option>
                        <option value="간식">간식</option>
                        <option value="야식">야식</option>
                    </select>

                    <div className={styles.addMenu}>
                        <input
                            type="text"
                            id="food-name"
                            name="foodName"
                            placeholder="메뉴를 입력하세요"
                            value={foodName}
                            onChange={(e) => setFoodName(e.target.value)}
                        />
                        <input
                            type="number"
                            min="0"
                            id="calories"
                            name="calories"
                            placeholder="칼로리 (선택사항)"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                        />
                        <button type="button" className={styles.addButton}
                        onClick={handleAddFood}>+</button>
                    </div>

                    <div className={styles.menuList}>
                        <h4>메뉴 목록</h4>
                        <ul>
                            {menuList.map((item) => (
                                <li key={item.id} className={styles.menuItem}>
                                    {item.name} {item.calories ? ` - ${item.calories} kcal` :   ''}
                                    <button type="button" className={styles.removeButton} 
                                    onClick={() => handleRemoveFood(item.id)}>
                                        {/* <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.4999 6L16.4999 10M16.4999 6L12.4999 10M18.5949 14.5H8.2979C7.7763 14.4999 7.27536 14.2961 6.9019 13.932L1.5519 8.716C1.45635 8.62284 1.38041 8.51149 1.32856 8.38852C1.27671 8.26555 1.25 8.13345 1.25 8C1.25 7.86655 1.27671 7.73445 1.32856 7.61148C1.38041 7.48851 1.45635 7.37716 1.5519 7.284L6.9019 2.068C7.27536 1.70387 7.7763 1.50005 8.2979 1.5H18.5949C19.5449 1.5 20.8179 2.041 20.8179 3.125V12.875C20.8179 13.959 19.5449 14.5 18.5949 14.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg> */}
                                        X
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <textarea
                        id="description"
                        name="description"
                        className={styles.content}
                        placeholder="간단한 메모를 남겨보세요."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <img
                            id="image-preview"
                            className={styles.imagePreview}
                            src={imagePreview}
                            alt="Image Preview"
                        />
                    )}
                    <button type="submit" className={styles.uploadBtn}>업로드</button>
                </form>
            </div>
        </div>
        </>
    );
};

export default Upload;



// const Upload = () => {
//     const [type, setCategory] = useState('');
//     const [foodName, setFoodName] = useState('');
//     const [description, setDescription] = useState('');
//     const [image, setImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState('');
//     const [menuList, setMenuList] = useState([]);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setImage(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreview(reader.result);
//             };
//             reader.readAsDataURL(file);
//         } else {
//             setImage(null);
//             setImagePreview('');
//         }
//     };

//     const handleAddFood = () => {
//         const newFood = {
//             id: Date.now(),
//             name: foodName,
//             isChecked: false,
//         };
//         setMenuList([...menuList, newFood]);
//         setFoodName('');
//     };

//     const handleRemoveFood = (id) => {
//         setMenuList(menuList.filter(item => item.id !== id));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log({ foodName, description, image });
//     };

//     return (
//         <>
//         <Sidebar />
//         <div className={styles.page}>
//             <div className={styles.uploadContainer}>
//                 <form className={styles.uploadForm} onSubmit={handleSubmit}>
//                     <select className={styles.mealCategory} value={type} onChange={(event) => setCategory(event.target.value)}>
//                         <option value="breakfast">아침</option>
//                         <option value="lunch">점심</option>
//                         <option value="dinner">저녁</option>
//                         <option value="snack">간식</option>
//                         <option value="nightEating">야식</option>
//                     </select>

//                     <div className={styles.addMenu}>
//                         <input
//                             type="text"
//                             id="food-name"
//                             name="foodName"
//                             placeholder="메뉴를 입력하세요"
//                             value={foodName}
//                             onChange={(e) => setFoodName(e.target.value)}
//                         />
//                         <button type="button" className={styles.addButton} onClick={handleAddFood}>추가</button>
//                     </div>

//                     <div className={styles.menuList}>
//                         <h3>추가된 음식</h3>
//                         <ul>
//                             {menuList.map((item) => (
//                                 <li key={item.id} className={styles.menuItem}>

//                                     {item.name}
//                                     <button type="button" className={styles.removeButton} onClick={() => handleRemoveFood(item.id)}>삭제</button>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                     <textarea
//                         id="description"
//                         name="description"
//                         className={styles.content}
//                         placeholder="간단한 메모를 남겨보세요."
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                     ></textarea>
//                     <input
//                         type="file"
//                         id="image"
//                         name="image"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                     />
//                     {imagePreview && (
//                         <img
//                             id="image-preview"
//                             className={styles.imagePreview}
//                             src={imagePreview}
//                             alt="Image Preview"
//                         />
//                     )}
//                     <button type="submit" className={styles.uploadBtn}>업로드</button>
//                 </form>
//             </div>
//         </div>
//         </>
//     );
// };

// export default Upload;


// const Upload = () => {
//     const [type, setCategory] = useState('');
//     const [foodName, setFoodName] = useState('');
//     const [description, setDescription] = useState('');
//     const [image, setImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState('');
//     const [menuList, setMenuList] = useState([]);

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setImage(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreview(reader.result);
//             };
//             reader.readAsDataURL(file);
//         } else {
//             setImage(null);
//             setImagePreview('');
//         }
//     };

//     const handleAddFood = () => {
//         setMenuList([...menuList, foodName]);
//         setFoodName('');
//     };

//     const handleRemoveFood = (id) => {
//         setMenuList(menuList.filter(item => item.id !== id));
//     };

//     const handleCheckChange = (id) => {
//         setMenuList(menuList.map(item => {
//             if (item.id === id) {
//                 return { ...item, isChecked: !item.isChecked };
//             }
//             return item;
//         }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log({ foodName, description, image });
//     };

//     return (
//         <>
//         <Sidebar />
//         <div className={styles.page}>
//             <div className={styles.uploadContainer}>
//                 <form className={styles.uploadForm} onSubmit={handleSubmit}>
//                     <select className={styles.mealCategory} value={type} onChange={(event) => setCategory(event.target.value)}>
//                         <option value="breakfast">아침</option>
//                         <option value="lunch">점심</option>
//                         <option value="dinner">저녁</option>
//                         <option value="snack">간식</option>
//                         <option value="nightEating">야식</option>
//                     </select>

//                     <div className={styles.addMenu}>
//                         <input
//                             type="text"
//                             id="food-name"
//                             name="foodName"
//                             placeholder="메뉴를 입력하세요"
//                             value={foodName}
//                             onChange={(e) => setFoodName(e.target.value)}
//                             required
//                         />
//                         <button type="button" className={styles.addButton} onClick={handleAddFood}>추가</button>
//                     </div>

//                     <div className={styles.menuList}>
//                         <h3>추가된 음식</h3>
//                         <ul>
//                             {menuList.map((item) => (
//                                 <>
//                                 <li key={item.id} className={styles.menuItem}>
//                                     <input
//                                         type="checkbox"
//                                         checked={item.isChecked}
//                                         onChange={() => handleCheckChange(item.id)}
//                                     />
//                                     {item.name}
//                                 </li>
//                                 <button type="button" className={styles.removeButton} onClick={() => handleRemoveFood(item.id)}>삭제</button>
//                                 </>
//                             ))}
//                         </ul>
//                     </div>
//                     <textarea
//                         id="description"
//                         name="description"
//                         className={styles.content}
//                         placeholder="간단한 메모를 남겨보세요."
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                         required
//                     ></textarea>
//                     <input
//                         type="file"
//                         id="image"
//                         name="image"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                     />
//                     {imagePreview && (
//                         <img
//                             id="image-preview"
//                             className={styles.imagePreview}
//                             src={imagePreview}
//                             alt="Image Preview"
//                         />
//                     )}
//                     <button type="submit" className={styles.uploadBtn}>업로드</button>
//                 </form>
//             </div>
//         </div>
//         </>
//     );
// };

// export default Upload;
