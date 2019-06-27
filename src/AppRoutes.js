import React from 'react';


import { Route } from "react-router-dom";

import Test from './test_folder/Test'

const AppRoutes = () => (<>
  <Route exact path='/' component={() => <h1>Arcadia</h1>} />
  <Route exact path='/test' component={Test} />
</>);

export default AppRoutes