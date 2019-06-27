import React, {useState} from "react";
import AWS from "aws-sdk";
import { Button, Form, Label, TextArea, Table } from "semantic-ui-react";
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
            setSentiment(data);
        }          // successful response
      });      
    })
}

const SentimentAnalysis = () => {
    const [detectedLanguage, setLanguage] = useState("es");
    const [text, setText] = useState("");
    const [sentiment, setSentiment] = useState(null);

    const handleChange = (e, { value }) => {
        e.preventDefault();
        setText(value);
        if(value.length > 0) languageDetection(value, setLanguage);
    }

    const handleClick = (text) => {
        detectSentiment(text, detectedLanguage, setSentiment)
    }

    const Sentiment = sentiment ? sentiment["Sentiment"]: null;
    const SentimentScore = sentiment ? sentiment["SentimentScore"]: null;

    return(
    <>    
    <Form>
        <Label>
            Default Language: {"es"}
        </Label>
        < br />
        <Label>
            Detected Language: {detectedLanguage}
        </Label>
        <TextArea onChange={handleChange} placeholder='Put your text here' />
        <Button onClick={() => handleClick(text)}>Submit</Button>
        <br />
        {Sentiment &&<Label>
            Detected Sentiment: {Sentiment} 
        </Label>}
        <br />
        {SentimentScore && <Table celled>
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Sentiment</Table.HeaderCell>
                <Table.HeaderCell>Percentage</Table.HeaderCell>
            </Table.Row>
            </Table.Header>

            <Table.Body>
            <Table.Row>
                <Table.Cell>Mixed</Table.Cell>
                <Table.Cell>{SentimentScore["Mixed"]}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Negative</Table.Cell>
                <Table.Cell>{SentimentScore["Negative"]}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Neutral</Table.Cell>
                <Table.Cell>{SentimentScore["Neutral"]}</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Positive</Table.Cell>
                <Table.Cell>{SentimentScore["Positive"]}</Table.Cell>
            </Table.Row>
            </Table.Body>
            </Table> }    
    </Form>
    
    </>);
  }

export default SentimentAnalysis;
