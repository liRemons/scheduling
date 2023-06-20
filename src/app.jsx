import React, { Component } from 'react';
import Gantt from './components/gantt';

const data = {
  data: [
    { id: 1, text: 'Task #1', start_date: '2023-06-15', duration: 3 },
    { id: 2, text: 'Task #2', start_date: '2023-06-18', duration: 2 }
  ],
  links: []
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