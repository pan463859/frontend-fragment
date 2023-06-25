import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { FixedSizeList, VariableSizeList } from './virtualList';
const Row = ({ index, style, forwardRef }) => {
  return (
    <div className={index % 2 ? 'list-item-odd' : 'list-item-even'} style={style} ref={forwardRef}>
      {`Row ${index}`}
    </div>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <header>高度固定的虚拟列表</header>
    <FixedSizeList /> */}
    <header>子项高度不固定的虚拟列表</header>
    <VariableSizeList />
  </React.StrictMode>
);

