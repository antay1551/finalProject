import React, { useState } from 'react';
import Content from "./components/content"
import {Provider, connect}   from 'react-redux';
import {store} from './store/reducer';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Content />
      </div>
    </Provider>
   );
}

export default App;
