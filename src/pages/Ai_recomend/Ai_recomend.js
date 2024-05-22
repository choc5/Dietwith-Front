import React from "react";
import {useEffect } from "react";
import axios from 'axios';

const fetchData = async () => {
    const [data, setData] = useState(null);
    const [randomItem, setRandomItem] = useState(null);

    try{
        const response = await axios.get("http://api.data.go.kr/openapi/tn_pubr_public_nutri_food_info_api");
        setData(response.data);
    }
    catch (error) {
        console.error("API call error:", error);
    }
}

const handleButtonClick = async () => {
    await fetchData();
    if (data) {
      const item = getRandomItem(data);
      setRandomItem(item);
    }
  };
  
const Ai_recomend = () => {
    return (
    <div>
      <button onClick={handleButtonClick}>랜덤 데이터 가져오기</button>

      {randomItem && (
        <div>
          <h1>랜덤 데이터</h1>
          <p>Title: {randomItem.title}</p>
          <p>Content: {randomItem.content}</p>
        </div>
      )}
    </div>
  );

}

export default Ai_recomend;