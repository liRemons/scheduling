import React, { Component, Fragment } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import './index.less';
import dayjs from 'dayjs'

export default class Gantt extends Component {
  state = {

  }

  componentDidMount() {
    gantt.i18n.setLocale("cn");
    gantt.config.date_format = "%Y-%m-%d %H:%i";
    const { tasks } = this.props;
    gantt.config.autoscroll = true;
    gantt.init(this.ganttContainer);
    gantt.config.xml_date = '%Y-%m-%d'; // 日期格式化的匹配格式
    gantt.config.scale_height = 90; // 日期栏的高度 
    const dayFormat = function (date) {
      const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      return ` ${dayjs(date).format('MM-DD')} </br > ${weeks[dayjs(date).day()]}`;
    };
    gantt.config.scales = [
      { unit: 'year', step: 1, format: '%Y' },
      { unit: 'day', step: 1, format: dayFormat }
    ];
    gantt.config.fit_tasks = true;
    gantt.config.columns = [
      {
        name: 'text',
        label: '任务名称',
        tree: false,
        width: '*',
        align: 'left',
        template: function (obj) {
          return obj.text;
        }
      },
      {
        name: 'start_date',
        label: '时间',
        width: '*',
        align: 'center',
        template: function (obj) {
          return obj.start_date;
        }
      },
      {
        name: 'duration',
        label: '日期区间',
        width: '*',
        align: 'right',
        template: function (obj) {
          return obj.duration;
        }
      },
      {
        name: 'add',
        label: '',
        width: '*',
        align: 'right',
        template: function (obj) {
          return obj.add;
        }
      },
    ];
    gantt.config.show_links = false;
    gantt.parse(tasks);
    gantt.plugins({
      marker: true
    });
  }

  handleClick = () => {
    console.log(gantt.getTaskCount());
  }

  render() {
    return (
      <Fragment>
        <div
          ref={(input) => { this.ganttContainer = input }}
          style={{ width: '100%', height: '100%' }}
        ></div>
        <button onClick={this.handleClick}>1111</button>
      </Fragment>
    );
  }
}
