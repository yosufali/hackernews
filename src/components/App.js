import React, { Component } from 'react'
import '../styles/App.css'
import LinkListPage from './LinkListPage.js'
import CreateLink from './CreateLink'

class App extends Component {
  render() {
    return (
      <CreateLink />
    );
  }
}

export default App;
