import React from 'react';
import { Table, Modal, Button, Form, message } from 'antd';
import { FormItem, ActionList } from 'remons-components';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import services from '../../axios';
import { DES_IV, DES_KEY, encrypt } from '../../crypto';

export default class UserList extends React.Component {
  state = {
    dataSource: [],
    visible: false,
    handleType: '',
    defaultValue: {},
    handleId: ''
  }

  getUserList = async () => {
    const res = await services.get('http://8.134.180.205:8009/user/queryUser');
    this.setState({ dataSource: res.data || [] })
  }

  async componentDidMount() {
    this.getUserList();
  }

  addUser = () => {
    this.setState({
      visible: true,
      handleType: 'add',
      defaultValue: {},
      handleId: ''
    });

  }

  onSubmit = async (values) => {
    const { handleType, handleId, defaultValue } = this.state;
    if (!values.password) {
      values.password = encrypt({ DES_KEY, DES_IV, MSG: values.pwd });
      delete values.pwd;
    }
    const { pwd, account } = values;
    const urlMap = {
      add: 'http://8.134.180.205:8009/user/addUser',
      edit: 'http://8.134.180.205:8009/user/updateUser',
      editPwd: 'http://8.134.180.205:8009/user/updateUser'
    }

    const methodMap = {
      add: 'post',
      edit: 'put',
      editPwd: 'put',
    }

    const res = await services({
      url: urlMap[handleType],
      method: methodMap[handleType],
      data: {
        ...defaultValue,
        id: handleId,
        account,
        password: ['editPwd', 'add'].includes(handleType) ? values.password : defaultValue.password
      }
    });
    if (res.success) {
      message.success(res.msg);
      this.setState({ visible: false });
      this.getUserList()
    } else {
      message.error(res.msg);
    }
  }

  del = (id) => {
    Modal.confirm({
      title: '确认删除吗?', onOk: async () => {
        const res = await services({
          url: 'http://8.134.180.205:8009/user/deleteUser',
          method: 'delete',
          data: {
            ids: [id]
          }
        });
        if (res.success) {
          message.success('删除成功');
          this.getUserList()
        }
      }
    });
  }

  edit = (id, record) => {
    this.setState({
      handleType: 'edit',
      visible: true,
      defaultValue: record,
      handleId: id
    })
  }

  editPwd = (id, record) => {
    this.setState({
      handleType: 'editPwd',
      visible: true,
      defaultValue: record,
      handleId: id
    })
  }

  onActionClick = (key, val, record) => {
    const handleMap = {
      del: this.del,
      edit: this.edit,
      editPwd: this.editPwd
    }
    handleMap[key] && handleMap[key](val, record)
  }

  render() {
    // <PlusCircleOutlined />
    const columns = [
      { title: '账号', dataIndex: 'account', key: 'account' },
      {
        title: '操作', dataIndex: 'id', render: (val, record) => {
          return <ActionList
            onActionClick={(key) => this.onActionClick(key, val, record)}
            actions={[
              {
                danger: true,
                isShow: record.role !== 'admin',
                shape: 'circle',
                key: 'del',
                icon: <DeleteOutlined />
              },
              {
                key: 'editPwd',
                label: '修改密码'
              }
            ].filter(item => item.isShow !== false)}

          />
        }
      }
    ];

    const { dataSource, visible, defaultValue, handleType } = this.state;
    const items = [
      { required: true, name: 'account', label: '账号', component: 'input' },
      { isShow: ['editPwd', 'add'].includes(handleType), required: true, name: 'pwd', label: '密码', component: 'inputPassword' },
    ].filter(item => item.isShow !== false);
    return <>
      <Button onClick={this.addUser} size='mini'><PlusCircleOutlined /></Button>
      <Table dataSource={dataSource} columns={columns} />
      <Modal onCancel={() => this.setState({ visible: false })} destroyOnClose title="操作" open={visible} footer={false}>
        <Form initialValues={defaultValue} onFinish={this.onSubmit}>
          {
            items.map(item => <FormItem {...item} key={item.name} />)
          }
          <FormItem>
            <Button type="primary" htmlType="submit">提交</Button>
          </FormItem>
        </Form>
      </Modal>
    </>
  }
}
