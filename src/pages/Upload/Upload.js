import React, { useState } from 'react';
import styles from './Upload.module.css';
import Sidebar from '../../components/SideBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
    const navigate = useNavigate();
    const [type, setCategory] = useState('');
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
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
            calories,
            isChecked: false,
        };
        setMenuList([...menuList, newFood]);
        setFoodName('');
        setCalories('');
    };

    const handleRemoveFood = (id) => {
        setMenuList(menuList.filter(item => item.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (type === "") {
            alert('식사 유형을 선택해주세요.');
            return;
        }
        if (menuList.length === 0) {
            alert('음식을 하나 이상 추가해주세요.');
            return;
        }
    
        const formData = new FormData();
        formData.append('type', type);
        formData.append('description', description);
        formData.append('image', image);
        formData.append('menuList', JSON.stringify(menuList)); // 배열을 JSON 문자열로 변환하여 추가
    
        try {
            const response = await axios.post('http://localhost:3001/api/upload', formData, { withCredentials: true });
            if (response.data.success) {
                alert('업로드에 성공했습니다!');
                setCategory('');
                setFoodName('');
                setCalories('');
                setDescription('');
                setImage(null);
                setImagePreview('');
                setMenuList([]);
                navigate("/Home");
            } else {
                alert('업로드 실패: ' + response.data.message);
            }
        } catch (error) {
            console.error('업로드 중 오류 발생:', error);
            alert('업로드 실패: ' + error.message);
        }
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
                            <button type="button" className={styles.addButton} onClick={handleAddFood}>+</button>
                        </div>

                        <div className={styles.menuList}>
                            <h4>메뉴 목록</h4>
                            <ul>
                                {menuList.map((item) => (
                                    <li key={item.id} className={styles.menuItem}>
                                        {item.name} {item.calories ? ` - ${item.calories} kcal` : ''}
                                        <button type="button" className={styles.removeButton} onClick={() => handleRemoveFood(item.id)}>X</button>
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