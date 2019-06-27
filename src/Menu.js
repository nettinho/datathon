import React from 'react';

import { Menu } from 'semantic-ui-react';
import { Link, withRouter } from "react-router-dom";

const rutas = [
  {name: "Home", to: "/"},
  {name: "Test", to: "/test"},
  {name: "Rekognition", to: "/rekognition"},
  {name: "Chatbot", to: "/chatbot"},
  {name: "ChatbotEs", to: "/chatbot_es"},
  {name: "Sentiment Analysis", to: "/sentiment_analysis"},
  {name: "Traductor", to: "/traductor"},
]
const ArcadiaMenu = ({location: {pathname}}) => (
  <Menu pointing secondary>
    {rutas.map( ({name, to}, key) => 
      <Menu.Item 
        key={key}
        name={name}
        active={pathname === to} 
        as={Link} 
        to={to}
      />)
    }
  </Menu>
);

export default withRouter(ArcadiaMenu)