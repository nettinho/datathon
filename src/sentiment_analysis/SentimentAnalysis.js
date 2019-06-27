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
    handleChange(e, { value }) {
        e.preventDefault();
    }

    render() {
        return (
            <Form>
                <TextArea onChange={this.handleChange} placeholder='Put your text here' />
            </Form>
        );
    }
}

export default SentimentAnalysis;
