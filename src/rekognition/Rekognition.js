import React from 'react'
import AWS from 'aws-sdk';
import Auth from '@aws-amplify/auth';

export default () => {
  const DetectFaces = (imageData) => {
    Auth.currentCredentials()
    .then(credentials => {
      var rekognition = new AWS.Rekognition({
        credentials: Auth.essentialCredentials(credentials)
      });


      var params = {
        Image: {
          Bytes: imageData
        },
        Attributes: [
          'ALL',
        ]
      };
      rekognition.detectFaces(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
        var table = "<table><tr><th>Low</th><th>High</th></tr>";
          // show each face and build out estimated age table
          for (var i = 0; i < data.FaceDetails.length; i++) {
            table += '<tr><td>' + data.FaceDetails[i].AgeRange.Low +
              '</td><td>' + data.FaceDetails[i].AgeRange.High + '</td></tr>';
          }
          table += "</table>";
          document.getElementById("opResult").innerHTML = table;
        }
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
        DetectFaces(imageBytes);
      };
    })(file);
    reader.readAsDataURL(file);
  }
  return <>
    <h1>Rekognition</h1>
    <input type="file" accept="image/*" onChange={imageSelected}/>
    <div id="opResult" />
  </>
}