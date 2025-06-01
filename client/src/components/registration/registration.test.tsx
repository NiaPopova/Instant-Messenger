import React from 'react';
import ReactDOM from 'react-dom';
import registration from './registration';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<registration />, div);
  ReactDOM.unmountComponentAtNode(div);
});