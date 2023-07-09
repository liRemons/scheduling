import React, { Component, createRef } from 'react';
import { gantt } from 'dhtmlx-gantt';
import { Form, Segmented, Button, Modal } from 'antd';
import { FormItem } from 'remons-components';
import { v4 as uuid } from 'uuid';
import './index.less';
import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css';
import dayjs from 'dayjs';
import { segmentedOptions, dayFormat, zoomConfig } from './const';


export default class Gantt extends Component {
  formRef = createRef();
  state = {
    addOpen: false,
    detail: {},
    handleType: 'add'
  }

  componentDidMount() {
    const { isPreview, tasks } = this.props;
    if (isPreview) {
      gantt.config.readonly = isPreview;
    }
    gantt.plugins({
      tooltip: true
    });
    gantt.templates.tooltip_text = function (start, end, task) {
      return "<b>AO:</b> " + task.text + "<br/><b>开始时间:</b> " +
        dayjs(start).format('YYYY-MM-DD HH:mm:ss') +
        "<br/><b>结束时间:</b> " + dayjs(end).format('YYYY-MM-DD HH:mm:ss');
    };
    gantt.i18n.setLocale("cn");
    gantt.config.date_format = "%Y-%m-%d %H:%i";
    gantt.config.autoscroll = true;
    gantt.init('gantt-here');
    gantt.config.xml_date = '%Y-%m-%d  %H:%i'; // 日期格式化的匹配格式
    gantt.config.scale_height = 90; // 日期栏的高度 

    gantt.config.scales = [
      { unit: 'year', step: 1, format: '%Y' },
      { unit: 'day', step: 1, format: dayFormat }
    ];
    gantt.ext.zoom.init(zoomConfig);
    gantt.config.fit_tasks = true;
    gantt.config.columns = [
      {
        name: 'text',
        label: '计划名称',
        tree: true,
        width: '*',
        align: 'left',
        template: function (obj) {
          return obj.text;
        }
      },
      {
        name: 'start_date',
        label: '开始时间',
        width: '*',
        align: 'center',
        template: function (obj) {
          return obj.start_date;
        }
      },
      {
        name: 'end_date',
        label: '结束时间',
        width: '*',
        align: 'center',
        template: function (obj) {
          return obj.end_date;
        }
      },
      // {
      //   name: 'duration',
      //   label: '日期区间',
      //   width: '*',
      //   align: 'right',
      //   template: function (obj) {
      //     return obj.duration;
      //   }
      // },
      {
        isShow: !isPreview,
        name: 'add',
      }
    ].filter(item => item.isShow !== false);
    gantt.config.show_links = false;
    gantt.parse(tasks);
    gantt.plugins({
      marker: true
    });

    gantt.showLightbox = () => false;
    gantt.config.lightbox.sections = [
      { name: "description", height: 38, map_to: "text", type: "textarea", focus: true },
      { name: "time", type: "duration", map_to: "auto", time_format: ["%d", "%m", "%Y", "%H:%i"] }
    ];

    gantt.attachEvent("onTaskCreated", (task) => {
      if (isPreview) {
        return false
      }
      this.addTask();
    });

    gantt.attachEvent("onTaskClick", (id, e) => {

      if (e.target.className.includes('gantt_add')) {
        this.handleClickTask(id, 'addChild')
      } else if (e.target.className.includes('gantt_task_content')) {
        this.handleClickTask(id)
      } else {
        return true;
      }
    });
  }


  handleClickTask = (id, type) => {
    const { isPreview } = this.props;
    if (isPreview) {
      return false;
    };

    const { end_date, start_date, text } = gantt.getTask(id);
    this.setState({
      detail: {
        text,
        id,
        addType: type,
        date: [dayjs(start_date), dayjs(end_date)]
      },
      handleType: 'edit'
    }, () => {
      this.setState({ addOpen: true })
    })
  }

  // console.log(gantt.getTaskBy("progress", 0, { task: true, project: true, milestone: true }));

  changeSegmented = (val) => {
    gantt.ext.zoom.setLevel(val);
  }

  addTask = () => {
    this.setState({
      addOpen: true,
      handleType: 'add'
    })
  }

  add = async () => {
    const { handleType, detail } = this.state;
    try {
      await this.formRef.current.validateFields();
      const { text, date } = this.formRef.current.getFieldsValue();
      const obj = {
        text,
        id: detail.id || uuid(),
        start_date: new Date(date[0].startOf('date').format('YYYY-MM-DD HH:mm:ss')),
        end_date: new Date(date[1].endOf('date').format('YYYY-MM-DD HH:mm:ss'))
      };
      if (handleType === 'add') {
        gantt.addTask(obj);
      } else if (handleType === 'edit') {
        if (detail.addType === 'addChild') {
          gantt.addTask({
            ...obj,
            parent: detail.id,
            id: uuid(),
          });
        } else {
          gantt.updateTask(detail.id, obj);

        }
      }

      this.onCancel()
    } catch (error) {
      throw error
    }
  }

  onCancel = () => {
    this.setState({ addOpen: false, detail: {} });
  }

  render() {
    const addItems = [
      {
        label: '排期名称',
        component: 'input',
        name: 'text',
        required: true
      },
      {
        label: '日期范围',
        component: 'rangePicker',
        name: 'date',
        required: true
      }
    ]
    const { addOpen, detail, handleType } = this.state;

    return (
      <div className="main-content">
        <Segmented defaultValue={'day'} options={segmentedOptions} onChange={this.changeSegmented} />
        <div id='gantt-here' style={{ width: '100%', height: '100%', padding: '0px', }}></div>
        <Modal
          destroyOnClose
          open={addOpen}
          title={handleType === 'add' ? '新增' : '修改'}
          onOk={this.add}
          onCancel={this.onCancel}
        >
          <Form initialValues={detail.addType === 'addChild' ? {} : detail} ref={this.formRef}>
            {
              addItems.map(item => <FormItem key={item.name} {...item} />)
            }
          </Form>
        </Modal>
      </div>
    );
  }
}
