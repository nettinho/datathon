import React from 'react';

import { BrowserRouter } from "react-router-dom";
import Menu from './Menu';
import AppRoutes from './AppRoutes';


function App() {
  return (
    <BrowserRouter>
      <Menu />
      <AppRoutes />
    </BrowserRouter>
  );
}



export default App;

