import React, { Component } from 'react';
import Gantt from './components/gantt';
import dayjs from 'dayjs'

const data = {
  data: []
};
class App extends Component {
  render() {
    return (
      <div>
        <div className="gantt-container">
          <Gantt tasks={data} />
        </div>
      </div>
    );
  }
}
export default App;