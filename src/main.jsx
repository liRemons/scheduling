import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import App from './app';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter } from 'react-router-dom'
ReactDOM.render(<BrowserRouter>
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
</BrowserRouter>, document.getElementById('container'));