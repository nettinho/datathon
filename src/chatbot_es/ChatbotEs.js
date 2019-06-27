import React, {useState} from 'react'

import Amplify, { Interactions } from 'aws-amplify';
import { Form } from 'semantic-ui-react'
import AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';

import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

const textStyle={
  padding: '7px',
  margin: '10px'
}
const meTextStyle={
  ...textStyle,
  background: '#15cc1575',
  textAlign: 'right'
}
const aiTextStyle={
  ...textStyle,
  background: '#dad1ab75'
}

export default () => {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")

  const translate = (text, toEs, callback) => Auth.currentCredentials()
  .then(credentials => {
    var translate = new AWS.Translate(
      new AWS.Config({
        region: "eu-west-1",
        credentials: Auth.essentialCredentials(credentials),
      })
    );
    var params = {
      SourceLanguageCode: toEs?'en':'es',
      TargetLanguageCode: toEs?'es':'en',
      Text: text,
    };
    translate.translateText(params, function(err, {TranslatedText}) {
      if (err) console.log(err, err.stack); // an error occurred
      else     callback(TranslatedText)
    });
  }) 


  const botSays = (text, messages) => {
    translate(text, true, traduccion => {
      setMessages(messages.concat([{fromMe: false, text: traduccion}]))
    })
  }
  const submit = () => {

    const newMessages = messages.concat([{
      fromMe: true, text
    }])
    setText("")
    setMessages(newMessages)

    translate(text, false ,traduccion => {
        Interactions.send("BookTrip_dev", traduccion)
          .then(({message}) => botSays(message, newMessages))
    })

    
  }
  return <>
    <h1>Chatbot Español</h1>
    <div style={{width: '500px', border: '1px solid black'}}>
      {messages.map(({fromMe, text}) => <div style={fromMe?meTextStyle:aiTextStyle}>{text}</div>)}
      <Form onSubmit={submit}>
        <Form.Field
          onChange={e => setText(e.target.value)}
        >
          <input value={text} placeholder='Preguntame sobre reservas de coches' />
        </Form.Field>
      </Form>
    </div>
  </>
}