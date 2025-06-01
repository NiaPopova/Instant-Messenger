import React from 'react';
import ReactDOM from 'react-dom';
import searchMessages from './searchMessages';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<searchMessages />, div);
  ReactDOM.unmountComponentAtNode(div);
});