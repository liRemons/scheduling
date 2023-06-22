import React, { useState } from 'react';
import Gantt from '../../components/gantt';
import Log from '../../components/log';
import { Steps, Button, Table } from 'antd';
import { ButtonBar, Form, FormItem } from 'remons-components';
import style from './index.module.less';

const App = () => {
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();

  const formLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const renderBasicForm = () => {
    const items = [
      {
        label: '参数1',
        name: 'params1',
        component: 'input'
      },
      {
        label: '参数2',
        name: 'params2',
        component: 'input'
      },
      {
        label: '参数3',
        name: 'params3',
        component: 'input'
      },
      {
        label: '参数4',
        name: 'params4',
        component: 'input'
      },
      {
        label: '参数5',
        name: 'params5',
        component: 'input'
      },
      {
        label: '参数6',
        name: 'params6',
        component: 'input'
      },
      {
        label: '参数7',
        name: 'params7',
        component: 'input'
      },
    ];

    return <Form  {...formLayout} cols={3} form={form} labelAlign="right" size="small">
      {
        items.map(item => <FormItem {...item} />)
      }
    </Form>
  }

  const renderList = () => {
    const columns = [
      { dataIndex: 'name', title: 'name1' }
    ]
    return <Table rowSelection={{ type: 'checkbox' }} columns={columns} dataSource={[{ name: 'test' }]} />
  };

  const renderGantt = () => {
    return <Gantt tasks={{ data: [] }} />
  }

  const stepItems = [
    {
      title: '基本参数',
      key: 'basicParams',
      children: renderBasicForm()
    },
    {
      title: '订单选择',
      key: 'selectOrder',
      children: renderList()
    },
    {
      title: '计划生成',
      key: 'createPlan',
      children: <Log />
    },
    {
      title: '计划调整',
      key: 'editPlan',
      children: renderGantt()
    },
  ];

  const prev = () => {
    setStep(step - 1)
  }

  const next = () => {
    setStep(step + 1)
  }

  return (
    <>
      <Steps
        size="small"
        current={step}
        items={stepItems}
      />
      {
        stepItems.map((item, index) => <div className={style.stepContent} style={{ display: step === index ? '' : 'none' }}>
          {item.children}
        </div>)
      }
      <ButtonBar isAffix={false}>
        {step !== 0 && <Button type="primary" onClick={prev}>上一步</Button>}
        {step !== stepItems.length - 1 && <Button type="primary" onClick={next}>下一步</Button>}
        {step === stepItems.length - 1 && <Button type="primary">完成</Button>}
        <Button>取消</Button>
      </ButtonBar>
    </>
  )
};
export default App;