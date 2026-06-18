import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './Dashboard';
import '../src/index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<Dashboard />);
}
