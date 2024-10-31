import React from "react";
import {useState, useEffect } from "react";
import axios from 'axios';
import SideBar from "../../components/SideBar";
import styles from './Ai_recomend.module.css';

function Ai_recomend() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [mealTime, setMealTime] = useState("저녁");

  // 권장 칼로리 계산 함수
  const calculateCalories = (height, weight, gender, activity) => {
    let bmr;
    if (gender === "M") {
      bmr = 88.36 + 13.4 * weight + 4.8 * height - 5.7 * 25; // 예시: 25세
    } else {
      bmr = 447.6 + 9.2 * weight + 3.1 * height - 4.3 * 25;
    }
    const activityFactor = activity === "활발" ? 1.55 : activity === "보통" ? 1.375 : 1.2;
    return Math.round(bmr * activityFactor);
  };

  // 현재 시간대에 맞는 추천 끼니 기본값 설정
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 10) setMealTime("아침");
    else if (hour >= 11 && hour < 13) setMealTime("점심");
    else if (hour >= 16 && hour < 19) setMealTime("저녁");
    else setMealTime("간식");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastRequestTime < 60000) {
      alert("1분 후에 다시 시도해주세요.");
      return;
    }
    setLastRequestTime(now);
    setLoading(true);

    try {
      const userId = "user_id"; //유저 ID
      
      const mockUserData = {
        user_height: 168,       // 키
        user_weight: 50,        // 몸무게
        user_gender: "F",       // 성별: 'M'은 남, 'F'는 여
        user_activity: "medium", // 활동량: "low", "medium", "high"
        user_purpose: "weight loss", // 식단 관리 목적
        user_hate: ["중식", "패스트푸드"], // 선호하지 않는 음식 리스트
        user_today_calories: 1800 // 오늘 섭취한 칼로리
      };
      
      //const { data: user } = await axios.get(`/api/user/${userId}`);

      // const userCalories = calculateCalories(
      //   user.user_height,
      //   user.user_weight,
      //   user.user_gender,
      //   user.user_activity
      // );

      const userCalories = calculateCalories(
        mockUserData.user_height,
        mockUserData.user_weight,
        mockUserData.user_gender,
        mockUserData.user_activity
      );

        // const promptText = `키: ${user.user_height}cm, 몸무게: ${user.user_weight}kg, 성별: ${
        //   user.user_gender === "M" ? "남" : "여"
        // }, 식단 관리 목적: ${user.user_purpose}, 선호하지 않는 음식: ${
        //   user.user_hate.join(", ")
        // }, 오늘 섭취한 칼로리: ${user.user_today_calories}Kcal, 일 권장 칼로리: ${userCalories}Kcal. 추천 희망 끼니: ${mealTime}. 위 조건에 적합한 식단을 추천해줘.`;


      const promptText = `키: ${mockUserData.user_height}cm, 몸무게: ${mockUserData.user_weight}kg, 성별: ${
        mockUserData.user_gender === "M" ? "남" : "여"
      }, 식단 관리 목적: ${mockUserData.user_purpose}, 선호하지 않는 음식: ${
        mockUserData.user_hate.join(", ")
      }, 오늘 섭취한 칼로리: ${mockUserData.user_today_calories}Kcal, 일 권장 칼로리: ${userCalories}Kcal. 추천 희망 끼니: ${mealTime}. 위 조건에 적합한 식단을 추천해줘.`;
      console.log(promptText);

      const result = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "키: 163cm, 몸무게: 60kg, 성별: 여, 식단 관리 목적: 다이어트, 선호하지 않는 음식: 중식, 피자, 오늘 섭취한 칼로리: 1856Kcal, 일 권장 칼로리: 2142Kcal. 추천 희망 끼니: 저녁"
              }
            ]
          },
          {
            "role": "assistant",
            "content": [
              {
                "type": "text",
                "text": "다이어트를 위해서는 일 권장 섭취량보다  400-600Kcal를 덜 섭취하는 게 좋아요. 오늘 저녁은 간단하게 연어 샐러드가 어떠신가요?"
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "키: 168cm, 몸무게: 44kg, 성별: 여, 식단 관리 목적: 건강관리, 선호하지 않는 음식: 국물요리, 스시, 샐러드, 오늘 섭취한 칼로리: 1856Kcal, 일 권장 칼로리: 2142Kcal. 추천 희망 끼니: 저녁"
              }
            ]
          },
          {
            "role": "assistant",
            "content": [
              {
                "type": "text",
                "text": "건강을 관리하기 위해서 일일 권장 칼로리를 준수하는 게 좋을 것 같아요. 오늘 저녁으로 김치 볶음밥은 어떠신가요?. 간단하면서 열량을 채워줄 식단이에요!"
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "키: 175cm, 몸무게: 60kg, 성별: 남, 식단 관리 목적: 벌크업, 선호하지 않는 음식: 중식,  오늘 섭취한 칼로리: 2200kcal, 일 권장 칼로리: 2142Kcal. 추천 희망 끼니: 저녁"
              }
            ]
          },
          {
            "role": "assistant",
            "content": [
              {
                "type": "text",
                "text": "벌크업을 위해서 단백질이 많은 고기를 먹어주는 게 좋을 것 같아요. 스테이크를 먹어보는 건 어떨까요?"
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "키: 180cm, 몸무게: 115kg, 성별: 남, 식단 관리 목적: 다이어트, 선호하지 않는 음식: 채소,  오늘 섭취한 칼로리: 3000kcal, 일 권장 칼로리: 2142Kcal. 추천 희망 끼니: 저녁"
              }
            ]
          },
          {
            "role": "assistant",
            "content": [
              {
                "type": "text",
                "text": "다이어트를 위해 일 권장 섭취량보다 400-600Kcal를 덜 섭취하는 것이 좋습니다. 오늘 저녁에는 구운 닭가슴살과 채소로 만든 요리를 추천드립니다. 간단하고 칼로리가 낮은 옵션일 수 있어요."
              }
            ]
          },
          { role: "user", content: promptText }],
          temperature: 1,
          max_tokens: 440,
          top_p: 0.77,
          frequency_penalty: 0.51,
          presence_penalty: 0.8,
          response_format: {
          "type": "text"},  
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      setResponse(result.data.choices[0].message.content);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <SideBar />
      <div className={styles.page}>
        <div className={styles.foodRecomenderBox}>
          <h1>AI에게 메뉴 추천 받기</h1>
          <form onSubmit={handleSubmit}>
            <select value={mealTime} onChange={(e) => setMealTime(e.target.value)}>
              <option value="아침">아침</option>
              <option value="점심">점심</option>
              <option value="저녁">저녁</option>
              <option value="간식">간식</option>
            </select>
            <button type="submit" disabled={loading} className={styles.recomendBtn}>
              {loading ? "불러오는 중..." : "추천 받기"}
            </button>
          </form>
          {response && (
            <div className={styles.response}>
              <h2>추천:</h2>
              <p>{response}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Ai_recomend;
