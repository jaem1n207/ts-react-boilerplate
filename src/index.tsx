import React from 'react';
import ReactDOM, { hydrate, render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';

import App from './App';

const renderApp = () => {
  const rootContent = document.getElementById('root');
  const renderMethod = module.hot ? render : hydrate;

  renderMethod(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    rootContent
  );
};

loadableReady(() => {
  renderApp();
});

if (module.hot) {
  module.hot.accept();
}
