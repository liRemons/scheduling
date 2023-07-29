import React, { useState, useEffect } from 'react';
import { Table, Modal, message } from 'antd';
import Gantt from '../../components/gantt';
import services from '../../axios';
import { ActionList } from 'remons-components';

const View = () => {
  const [open, setOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [tasks, setTasks] = useState([])

  const actions = [
    {
      label: '详情',
      key: 'detail',
      type: 'link',
    },
    {
      label: '删除',
      key: 'del',
      type: 'link',
    },

  ];

  const getList = async () => {
    const res = await services({
      url: 'http://8.136.206.131:8009/info/queryMyInfo'
    });
    setDataSource(res.data)
  }

  useEffect(() => {
    getList()
  }, [])

  const columns = [
    { dataIndex: 'id', title: 'id' },
    {
      dataIndex: 'data', title: '操作', render: (val, record) => {
        return <ActionList onActionClick={(key, data) => onActionClick(key, { ...data, val, id: record.id })} actions={actions} />;
      }
    },
  ];

  const onClose = () => {
    setOpen(false)
  }

  const openDetail = async (data) => {
    
    const res = await services({
      url: 'http://8.136.206.131:8009/info/queryMyInfoDetail',
      method: 'get',
      params: {
        id: data.id
      }
    });
    if (res.code === 200 && res.success) {
      const tasks = (JSON.parse(res.data[0]?.data || '') || []).map(item => {
        return {
          id: item.ao_no,
          text: item.ao_name,
          start_date: item.start,
          end_date: item.end
        }
      });
      setTasks(tasks);
      setOpen(true)
    }
  }

  const del = async (data) => {
    const res = await services({
      url: 'http://8.136.206.131:8009/info/deleteMyInfo',
      method: 'delete',
      data: {
        id: data.id
      }
    });
    if (res.code === 200 && res.success) {
      message.success('删除成功');
      getList()
    }
  }

  const onActionClick = (key, data) => {
    const handleMap = {
      del: del,
      detail: openDetail
    }

    handleMap[key]?.(data)
  };

  return <>
    <Table columns={columns} dataSource={dataSource} />
    <Modal width={1000} bodyStyle={{ height: '500px' }} open={open} title="计划详情" getContainer={() => document.getElementById('container')} onCancel={onClose} destroyOnClose>
      <Gantt tasks={{
        data: tasks
      }} isPreview />
    </Modal>
  </>
}

export default View;
