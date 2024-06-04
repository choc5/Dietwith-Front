import React, { useEffect, useState } from "react";
import "./Profile.css";

export default function Profile() {
    useState(() => {}, []);
    useEffect(() => {}, []);

    return(
        <div className="profile-presenter">
            <div className="profile-image"></div>
            <div className="profile-name">올라운더</div>
        </div>
    )

}