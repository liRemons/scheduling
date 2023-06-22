import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';
import Gantt from '../../components/gantt';

const View = () => {
  const [open, setOpen] = useState(false);

  const handle = () => {
    setOpen(true)
  }

  const columns = [
    { dataIndex: 'name', title: '字段1' },
    { dataIndex: 'handle', title: '操作', render: () => <Button type='link' onClick={handle}>操作</Button> },
  ];

  const dataSource = [
    { name: '1' }
  ];


  const onClose = () => {
    setOpen(false)
  }

  return <>
    <Table columns={columns} dataSource={dataSource} />
    <Modal width={1000} bodyStyle={{ height: '500px' }} open={open} title="计划详情" getContainer={() => document.getElementById('container')} onCancel={onClose} destroyOnClose>
    <Gantt tasks={{ data: [{ start_date: new Date(), id: '1', text: 's', end_date: new Date('2023-09-05') }] }}  isPreview/>
    </Modal>
  </>
}

export default View;