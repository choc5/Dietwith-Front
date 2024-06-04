import React from "react";
import {useState, useEffect } from "react";
import axios from 'axios';
import SideBar from "../../components/SideBar";
import styles from './Ai_recomend.module.css';

  
const Ai_recomend = () => {

  const [foodName, setFoodName] = useState('');
  const [foodCal, setFoodCal] = useState('');
  const serviceKey = encodeURIComponent('sY/6WpLYFBJYlmLBQIfarvo08u5vmduk0U/hfPVCi9NWir3dc9Rg10flh1IxMPPABXO6+rkDSzU+50Qp7KS0Wg==');
  const baseUrl = `http://api.data.go.kr/openapi/tn_pubr_public_nutri_food_info_api?serviceKey=${serviceKey}&type=xml`;

  const fetchFood = async () => {
    try {
      const foods = []; // 빈 배열로 초기화
      while (foods.length < 30) {
        const pageNo = Math.floor(Math.random() * 122) + 1; // 1부터 122까지의 랜덤 페이지 번호
        const response = await axios.get(`${baseUrl}&pageNo=${pageNo}&numOfRows=100`);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");
        const items = xmlDoc.getElementsByTagName('item');
  
        for (let i = 0; i < items.length; i++) {
          const enerc = items[i].getElementsByTagName('enerc')[0].textContent;
          if (enerc && parseInt(enerc, 10) >= 200 && parseInt(enerc, 10) <= 300) { // 칼로리 기준
            const foodNm = items[i].getElementsByTagName('foodNm')[0].textContent;
            foods.push({ foodName: foodNm, calories: enerc }); // 객체 형태로 추가
          }
          if (foods.length >= 30) break;
        }
      }
      
      const randomIndex = Math.floor(Math.random() * foods.length); // 랜덤 인덱스
      const name = extractFoodName(foods[randomIndex].foodName);
      setFoodName(name); // 랜덤으로 선택된 음식의 이름
      setFoodCal(foods[randomIndex].calories); // 랜덤으로 선택된 음식의 칼로리
    } 
    catch (error) {
      console.error('API 호출 중 오류 발생:', error);
    }
  };

  const extractFoodName = (fullName) => {
    const [prefix, rest] = fullName.split('_');
    const name = rest.split(' (')[0];
    return name.trim();
  };
  

  useEffect(() => {
    // fetchFood();
  }, []);

  return (
    <>
    <SideBar/>
    <div className={styles.page}>
        <div className={styles.foodRecomenderBox}>
          <div className={styles.recomendContent}>
            <h2>추천 메뉴 : {foodName}</h2>
            <div>칼로리 : {foodCal} Kcal</div>
          </div>
        </div>
        <div className={styles.recomendBtn} onClick={fetchFood}>
          추천 받기
        </div>
    </div>
    </>
  );
}

export default Ai_recomend;
