import React, {useState} from 'react'
import AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';

import { Table, Progress } from 'semantic-ui-react'

export default () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const detectLabels = (imageData) => {
    Auth.currentCredentials()
    .then(credentials => {
      var rekognition = new AWS.Rekognition(
        new AWS.Config({
          region: "eu-west-1",
          credentials: Auth.essentialCredentials(credentials),
        })
      );
      var params = {
        Image: {
          Bytes: imageData
        }
      };
      setLoading(true)
      rekognition.detectLabels(params, (err, data) => {
        setLoading(false)
        if (err) console.log(err, err.stack); // an error occurred
        else setData(data)
      });

    })
  }
  const imageSelected=(e)=>{
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = ((theFile) => {
      return e => {
        var img = document.createElement('img');
        var image = null;
        img.src = e.target.result;
        var jpg = true;
        try {
          image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);
        } catch (e) {
          jpg = false;
        }
        if (jpg == false) {
          try {
            image = atob(e.target.result.split("data:image/png;base64,")[1]);
          } catch (e) {
            alert("Not an image file Rekognition can process");
            return;
          }
        }
        //unencode image bytes for Rekognition DetectFaces API 
        var length = image.length;
        const imageBytes = new ArrayBuffer(length);
        var ua = new Uint8Array(imageBytes);
        for (var i = 0; i < length; i++) {
          ua[i] = image.charCodeAt(i);
        }
        //Call Rekognition  
        detectLabels(imageBytes);
      };
    })(file);
    reader.readAsDataURL(file);
  }
  return <>
    <h1>Rekognition</h1>
    {!loading 
      ? <input type="file" accept="image/*" onChange={imageSelected}/>
      : <Progress percent={100} indicating />}
    {data && 
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Confidence</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.Labels.map( ({Name, Confidence}, key) => (
            <Table.Row key={key}>
              <Table.Cell>{Name}</Table.Cell>
              <Table.Cell>{Confidence}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    }
  </>
}