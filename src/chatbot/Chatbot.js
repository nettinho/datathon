import React from 'react'

import Amplify, { Interactions } from 'aws-amplify';
import { ChatBot, AmplifyTheme } from 'aws-amplify-react';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);


const myTheme = {
  ...AmplifyTheme,
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: '#0f0f0f'
  }
};

export default () => {
  const handleComplete = (err, confirmation) => {
    if (err) {
      alert('Bot conversation failed')
      return;
    }

    alert('Success: ' + JSON.stringify(confirmation, null, 2));
    return 'Trip booked. Thank you! what would you like to do next?';
  }
  return <ChatBot
    title="Chatbot Arcadia"
    theme={myTheme}
    botName="BookTrip_dev"
    welcomeMessage="Welcome to car rentals, how can I help you today?"
    onComplete={handleComplete}
    clearOnComplete={true}
    conversationModeOn={false}
/>
}