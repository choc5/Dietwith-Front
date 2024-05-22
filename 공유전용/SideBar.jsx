import React from "react";
import './SideBar.css';

export default function SideBar() {
    return(
        <div className="side-bar">
            <div className="logo">
                <div className="logo-title">Dietwith</div>
            </div>
            <div className="side-bar-options">
                <div className="side-bar-option" id="option1">
                    <div className="option-title">홈</div>
                </div>
                <div className="side-bar-option" id="option2">
                    <div className="option-title">업로드</div>
                </div>
                <div className="side-bar-option" id="option3">
                    <div className="option-title">기록</div>
                </div>
                <div className="side-bar-option" id="option4">
                    <div className="option-title">친구</div>
                </div>
                <div className="side-bar-option" id="option5">
                    <div className="option-title">식단 추천</div>
                </div>
            </div>
        </div>
    )
}