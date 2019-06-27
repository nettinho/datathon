import _ from "lodash/fp"
import React from "react";
import { Form, TextArea } from "semantic-ui-react";

export class SentimentAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detectedLanguage: "",
            unputText: ""
        };
    }
    render() {
        return (
            <Form>
                <TextArea placeholder='Put your text here' />
            </Form>
        );
    }
}

export default SentimentAnalysis;
