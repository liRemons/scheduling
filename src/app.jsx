import React, { Component } from 'react';
import Gantt from './components/gantt';
import Router from './router';
import Layout from './components/layout';

const data = {
  data: []
};
class App extends Component {
  render() {
    return (
      <Layout>
        <Router />
        {/* <Gantt tasks={data} /> */}
      </Layout>
    );
  }
}
export default App;