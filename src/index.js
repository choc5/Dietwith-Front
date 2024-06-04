import React from 'react';
import ReactDOM from 'react-dom/client';

/* URL설정을 위한 라이브러리 */
import { BrowserRouter as Router } from 'react-router-dom';

/* 모든 페이지의 최상위 페이지를 불러온다. */
import App from './App';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  /* Router로 페이지들을 감싸줌으로써 URL설정을 할 수 있다. */
  <Router>

    {/*
      최상위 페이지 출력
        * 윈도우의 경우 Ctrl을 누르신 뒤 App을 클릭하시면 해당 파일로 이동하실 수 있습니다.
        * 맥의 경우 Command를 누르신 뒤 App을 클릭하시면 해당 파일로 이동하실 수 있습니다.
     */}
    <App />

  </Router>
);

export default App;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
