import React from 'react';


import { Route } from "react-router-dom";

import Test from './test_folder/Test'
import SentimentAnalysis from './sentiment_analysis/SentimentAnalysis';
import Rekognition from './rekognition/Rekognition'
import Chatbot from './chatbot/Chatbot'
import ChatbotEs from './chatbot_es/ChatbotEs'
import Traductor from './traductor/Traductor'


const AppRoutes = () => (<>
  <Route exact path='/' component={() => <h1>Arcadia</h1>} />
  <Route exact path='/test' component={Test} />
  <Route exact path='/sentiment_analysis' component={SentimentAnalysis} />
  <Route exact path='/rekognition' component={Rekognition} />
  <Route exact path='/chatbot' component={Chatbot} />
  <Route exact path='/chatbot_es' component={ChatbotEs} />
  <Route exact path='/traductor' component={Traductor} />
</>);

export default AppRoutes