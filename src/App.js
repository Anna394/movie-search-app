import React, { Component } from 'react';
import { Tabs } from 'antd';

import MovieList from './components/MovieList';
import { createGuestSession } from './api';
import RatedMovies from './components/RatedMovies';
import { GenreProvider } from './context/GenreContext.js';

const { TabPane } = Tabs;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'search',
    };
  }

  componentDidMount() {
    if (!localStorage.getItem('guest_session_id')) {
      createGuestSession();
    }
  }

  handleTabChange = (activeTab) => {
    this.setState({ activeTab });
  };

  render() {
    const { activeTab } = this.state;
    return (
      <GenreProvider>
        <div>
          <Tabs activeKey={activeTab} onChange={this.handleTabChange} centered>
            <TabPane tab="Search" key="search">
              <MovieList />
            </TabPane>
            <TabPane tab="Rated" key="rated">
              <RatedMovies activeTab={activeTab} />
            </TabPane>
          </Tabs>
        </div>
      </GenreProvider>
    );
  }
}

export default App;
