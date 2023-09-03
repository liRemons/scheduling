import React from 'react';
import styled from './index.module.less';
import { Form, Button, message } from 'antd';
import { FormItem } from 'remons-components';
import service from '../../axios';
import svg from '../../assets/svg/login.svg'
import { DES_IV, DES_KEY, encrypt } from '../../crypto';

class Login extends React.Component {
  onFinish = async (values) => {
    const { pwd, account } = values;
    const res = await service.post('http://8.134.180.205:8009/user/login', {
      account,
      password: encrypt({ DES_IV, DES_KEY, MSG: pwd })
    });
    if (res?.success) {
      message.success('成功')
      localStorage.setItem('REMONS_TOKEN', res.data.token);
      window.location.href = '/'
    }
  };

  render() {
    const items = [
      { required: true, name: 'account', label: '账号', component: 'input' },
      { required: true, name: 'pwd', label: '密码', component: 'inputPassword' },
    ]
    return <div className={styled.container}>
      <div className={styled.login}>
        <img src={svg} alt="" />
      </div>
      <Form onFinish={this.onFinish}>
        {
          items.map(item => <FormItem {...item} key={item.name} />)
        }
        <FormItem>
          <Button type="primary" htmlType="submit">登录</Button>
        </FormItem>
      </Form>
    </div>
  }
}

export default Login