import React, {useState} from "react";
import AWS from "aws-sdk";
import { Button, Form, Label, TextArea, Table,Select } from "semantic-ui-react";
import Auth from '@aws-amplify/auth';

const languageDetection = (value, setLanguage) => {
    Auth.currentCredentials()
    .then(credentials => {
      const comprehend = new AWS.Comprehend(
        new AWS.Config({
          region: "eu-west-1",
          credentials: Auth.essentialCredentials(credentials),
        })
      );
      const params = { TextList: [value] };
      comprehend.batchDetectDominantLanguage(params, function(err, data) {
        if (err) console.log(err, err.stack); 
        else {
            const { ResultList } = data;
            const languages = ResultList[0]["Languages"];
            const detectedLanguage = languages[0]
            const detectedLanguageText = detectedLanguage["LanguageCode"];
            setLanguage(detectedLanguageText);
        }           
      });
    })
}

const detectSentiment = (value, ln, setSentiment) => {
    Auth.currentCredentials()
    .then(credentials => {
      const comprehend = new AWS.Comprehend(
        new AWS.Config({
          region: "eu-west-1",
          credentials: Auth.essentialCredentials(credentials),
        })
      );
      const len = ["de", "pt", "en", "it", "fr", "es"].includes(ln) ? ln : "es"
      const params = {
        LanguageCode: len, /* required */
        Text: value /* required */
      };
      comprehend.detectSentiment(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else { 
            setSentiment(data.Sentiment);
        }          // successful response
      });      
    })
}
const detectEntities = (value, ln, setEntities) => {
    Auth.currentCredentials()
    .then(credentials => {
      const comprehend = new AWS.Comprehend(
        new AWS.Config({
          region: "eu-west-1",
          credentials: Auth.essentialCredentials(credentials),
        })
      );
      const len = ["de", "pt", "en", "it", "fr", "es"].includes(ln) ? ln : "es"
      const params = {
        LanguageCode: len, /* required */
        Text: value /* required */
      };
      comprehend.detectEntities(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else { 
            setEntities(data);
        }          // successful response
      });      
    })
}
const detectKeyPhrases = (value, ln, setKeyPhrases) => {
    Auth.currentCredentials()
    .then(credentials => {
      const comprehend = new AWS.Comprehend(
        new AWS.Config({
          region: "eu-west-1",
          credentials: Auth.essentialCredentials(credentials),
        })
      );
      const len = ["de", "pt", "en", "it", "fr", "es"].includes(ln) ? ln : "es"
      const params = {
        LanguageCode: len, /* required */
        Text: value /* required */
      };
      comprehend.detectKeyPhrases(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else { 
            setKeyPhrases(data);
        }          // successful response
      });      
    })
}

const SentimentAnalysis = () => {
    const [detectedLanguage, setLanguage] = useState("es");
    const [text, setText] = useState("");
    const [targetLang, setTargetLang] = useState("en");
    const [translated, setTranslated] = useState("");
    const [sentiment, setSentiment] = useState(null);
    const [entities, setEntities] = useState(null);
    const [keyPhrases, setKeyPhrases] = useState(null);


    const translate = (text, from, callback) => Auth.currentCredentials()
      .then(credentials => {
        var translate = new AWS.Translate(
          new AWS.Config({
            region: "eu-west-1",
            credentials: Auth.essentialCredentials(credentials),
          })
        );
        var params = {
          SourceLanguageCode: from,
          TargetLanguageCode: targetLang,
          Text: text,
        };
        translate.translateText(params, function(err, {TranslatedText}) {
          if (err) console.log(err, err.stack); // an error occurred
          else     callback(TranslatedText)
        });
      }) 

    const handleChange = (e, { value }) => {
        e.preventDefault();
        setText(value);
        if(value.length > 0) languageDetection(value, setLanguage);
    }

    const handleClick = (text) => {
        translate(text, detectedLanguage, translated=>{
          setTranslated(translated)
          detectSentiment(translated, detectedLanguage, setSentiment)
          detectEntities(translated, detectedLanguage, setEntities)
          detectKeyPhrases(translated, detectedLanguage, setKeyPhrases)
        })
    }

    console.log("entities", entities)
    console.log("keyPhrases", keyPhrases)
    return(
    <>    
    <Form>
        <Label>
            Default Language: {"es"}
        </Label>
        < br />
        < br />
        Idioma traducción:
        <Select 
          placeholder='Seleccione idioma'
          value={targetLang}
          options={[
            {key: 'en', value: 'en', text: 'Ingles'},
            {key: 'pt', value: 'pt', text: 'Portugues'},
            {key: 'fr', value: 'fr', text: 'Frances'},
            {key: 'es', value: 'es', text: 'Español'},
          ]} 
          onChange={(e, {value})=>setTargetLang(value)}
          />
          < br />
          < br />
        <Label>
            Detected Language: {detectedLanguage}
        </Label>
        < br />
        < br />
        <TextArea onChange={handleChange} placeholder='Put your text here' />
        <Button onClick={() => handleClick(text)}>Submit</Button>
        <br />
        <br />
        <br />
        {translated && <>
          <h2>Mesaje traducido</h2>
          <span
            style={{fontSize: '15px'}}
          >{translated}</span>
          <br />
          <br />
          </>
        }
        {sentiment &&<Label>
            Sentimiento detectado: {sentiment} 
        </Label>}<br/>
        <Label>
            Entidades detectadas
        </Label>
        {entities && <Table celled>
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Texto</Table.HeaderCell>
                <Table.HeaderCell>Tipo</Table.HeaderCell>
                <Table.HeaderCell>Puntuación</Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body>
            {entities.Entities.map(({Text, Type, Score}, key) =>
              <Table.Row key={key}>
                  <Table.Cell>{Text}</Table.Cell>
                  <Table.Cell>{Type}</Table.Cell>
                  <Table.Cell>{Score}</Table.Cell>
              </Table.Row>
            )}
            </Table.Body>
          </Table>
          }
        <br />
        <Label>
            Frases claves detectadas
        </Label>
        {keyPhrases && <Table celled>
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Texto</Table.HeaderCell>
                <Table.HeaderCell>Puntuación</Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body>
            {keyPhrases.KeyPhrases.map(({Text, Score}, key) =>
              <Table.Row key={key}>
                  <Table.Cell>{Text}</Table.Cell>
                  <Table.Cell>{Score}</Table.Cell>
              </Table.Row>
            )}
            </Table.Body>
          </Table>
          }
    </Form>
    
    </>);
  }

export default SentimentAnalysis;
