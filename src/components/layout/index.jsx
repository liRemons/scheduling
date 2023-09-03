import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import style from './index.module.less';

const { Header, Sider, Content } = Layout;
const App = ({ children }) => {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/login') {
      localStorage['REMONS_TOKEN'] ? '' : navigate(`/login`)
    }
  }, []);

  if (location.pathname === '/login') {
    return children;
  }
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onMenuClick = ({ item, key }) => {
    navigate(`/${key}`)
  }
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          onClick={onMenuClick}
          defaultSelectedKeys={[location.pathname.replace('/', '')]}
          items={[
            {
              key: 'planForm',
              label: '生成计划',
            },
            {
              key: 'planList',
              label: '计划列表',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          className="site-layout"
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;