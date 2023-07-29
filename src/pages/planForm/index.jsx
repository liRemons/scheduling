import React, { useState, useEffect, useRef } from 'react';
import Gantt from '../../components/gantt';
import { useNavigate } from 'react-router';
import { Steps, Button, Table, Spin, message, Segmented } from 'antd';
import { ButtonBar, Form, FormItem } from 'remons-components';
import style from './index.module.less';
import dayjs from 'dayjs';
import services from '../../axios';

const App = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [gattData, setGattData] = useState([]);
  const [gattType, setGanttType] = useState('gantt');
  const [params, setParams] = useState({});
  const ganttRef = useRef(null);

  const formLayout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
  };

  const getaAO = ({ reqParams, RECORDS }) => {
    services({
      url: 'http://8.134.180.205:5000/engineer/ao',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        ...reqParams,
        input_workstation_schedule_init: {
          RECORDS
        }
      }
    })
      .then(res => {
        setLoading(false);
        setGattData(res.data)
      }).catch(err => {
        console.log(err);
        setLoading(false);
        message.error('请求失败')
      })
  }

  const getPlan = (data) => {
    setLoading(true)
    const reqParams = {
      "solve_time_limit": 60,
      "boundary": 16,
      "reload": false,
      "allow_fast_load": true,
      ...data
    }
    services({
      url: 'http://8.134.180.205:5000/engineer/workstation',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        ...reqParams,
        "input_json_init": {
          "200": [{ "ZIBA开始": "2022-11-26", "ZIBB完成": "2023-02-24" }],
          "201": [{ "ZIBA开始": "2022-12-22", "ZIBB完成": "2023-03-20" }]
        },
        "k_num_fixture": 2
      }
    })
      .then(res => {
        const RECORDS = res?.data.map((item, index) => {
          if (!Object.keys(item?.schedule)?.length) {
            return false;
          }
          const params = {};
          for (const key in (item?.schedule || {})) {
            if (key.replace('开始', '_start').includes('_start')) {
              params[key.replace('开始', '_start')] = item?.schedule[key];
            }
            if (key.replace('完成', '_end').includes('_end')) {
              params[key.replace('完成', '_end')] = item?.schedule[key];
            }
          }
          return {
            id: index + 1,
            ...params,
            plane_no: item.plane_no
          }
        }).filter(item => !!item)
        getaAO({ reqParams, RECORDS })
      })
      .catch(err => {
        setLoading(false)
        console.log(err);
        message.error('请求失败')
      });
  }

  useEffect(() => {
    form.setFieldsValue({
      plane_no: 200,
      target_plane_cnt: 15,
      line: 2,
      workdays_year: 250,
      hours_day: 10
    })
  }, [])

  const renderBasicForm = () => {
    const items = [
      {
        label: '排产开始日期',
        name: 'start_time',
        component: 'datePicker',
        required: true,
        componentProps: {
          showTime: true
        }
      },
      {
        label: '排产开始架次',
        name: 'plane_no',
        required: true,
        component: 'input'
      },
      {
        label: '年度生产飞机架数',
        name: 'target_plane_cnt',
        component: 'inputNumber',
        required: true,
        componentProps: {
          disabled: true
        }
      },
      {
        label: '产线条数',
        name: 'line',
        component: 'inputNumber',
        required: true,
        componentProps: {
          min: 0
        }
      },
      {
        label: '工作日天数',
        name: 'workdays_year',
        component: 'inputNumber',
        required: true,
        componentProps: {
          min: 0,
          max: 366,
        }
      },
      {
        label: '一天工作时长',
        name: 'hours_day',
        component: 'inputNumber',
        required: true,
        componentProps: {
          min: 0,
          max: 24,
        }
      },
    ];

    return <Form  {...formLayout} cols={2} form={form} labelAlign="right" size="small">
      {
        items.map(item => <FormItem {...item} />)
      }
    </Form>
  }

  const renderList = (dataSource) => {
    const columns = [
      { dataIndex: 'plane_no', title: '架次', width: 100, fixed: 'left', },
      { dataIndex: 'stand_station', title: 'AO名称', width: 100, fixed: 'left', },
      { dataIndex: 'ao_no_source', title: '是否置零', width: 100, fixed: 'left', },
      { dataIndex: 'stand_station', title: '站位', width: 150, },
      { dataIndex: 'taskid', title: '任务ID', width: 150, },
      { dataIndex: 'fixed_time', title: '任务工时', width: 150, },
      { dataIndex: 'day_time', title: '每天工作时长', width: 150, },
      { dataIndex: 'work_type', title: '工种', width: 150, },
      { dataIndex: 'fixed_staff', title: '需求人数', width: 150, },
      { dataIndex: 'actual_staff', title: '实际人数', width: 150, },
      { dataIndex: 'start', title: '开始时间', width: 150, },
      { dataIndex: 'duration', title: '工时', width: 150, },
      { dataIndex: 'end', title: '结束时间', width: 150, },
      { dataIndex: 'space_name', title: '站位名称', width: 150, },
      { dataIndex: 'limits', title: '站位人数限制', width: 150, },
      { dataIndex: 'fixture_id_origin', title: '型架号', width: 150, },
    ]
    return <Table
      scroll={{
        x: 1500,
        y: 300,
      }}
      columns={columns}
      dataSource={dataSource} />
  };

  const changeSegmented = (value) => {
    setGanttType(value)
  }

  const renderGantt = () => {
    if (!gattData?.length) {
      return null;
    }

    const tasks = gattData.map(item => {
      return {
        id: `${item.ao_no}_${item.taskid}`,
        text: item.ao_name,
        start_date: item.start,
        end_date: item.end
      }
    });

    const Map = {
      list: renderList(gattData),
      gantt: <Gantt ref={ganttRef} tasks={{
        data: tasks
      }} />
    }


    return <>
      <Segmented
        defaultValue={'gantt'}
        options={[{ label: '甘特', value: 'gantt' }, { label: '表格', value: 'list' }]}
        onChange={changeSegmented}
      />
      {
        Map[gattType]
      }

    </>
  }

  const stepItems = [
    {
      title: '基本参数',
      key: 'basicParams',
      children: renderBasicForm()
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

  const next = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue()
      const params = {
        ...values,
        start_time: values.start_time ? dayjs(values.start_time).format('YYYY-MM-DD HH:mm:ss') : ''
      };
      setParams(params);
      getPlan(params);
      setStep(step + 1)
    } catch (error) {
      console.log(error);
    }

  }

  const onSubmit = async () => {
    try {
      setLoading(true);
      const res = await services({
        url: 'http://8.134.180.205:8009/info/createScheduling',
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: {
          params,
          data: JSON.stringify(ganttRef.current.onSave())
        }
      });
      if (res.code === 200 && res.success) {
        message.success('保存成功');
        setLoading(false);
        navigate('/planList')
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }

  }

  const container = <>
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
      {step === stepItems.length - 1 && <Button type="primary" onClick={onSubmit}>完成</Button>}
      <Button>取消</Button>
    </ButtonBar>
  </>

  if (loading) {
    return <Spin tip='耗时较长，请耐心等待' spinning={loading}>
      {container}
    </Spin>
  } else {
    return container
  }
};
export default App;
