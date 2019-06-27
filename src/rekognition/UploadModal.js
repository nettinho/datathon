import React from "react";
import PropTypes from "prop-types";
import { Modal, Button, Icon, Container, List } from "semantic-ui-react";
import Dropzone from "react-dropzone";

const dropzoneStyle = {
  width: "100%",
  marginBottom: "10px",
  border: "1px dashed gray",
  borderRadius: "5px"
};
const dropzoneStyleHover = {
  width: "100%",
  marginBottom: "10px",
  border: "1px dashed #6baf15",
  borderRadius: "5px",
  overflow: "hidden"
};

const dropzoneActiveStyle = {
  padding: "20px",
  width: "100%",
  height: "100%",
  color: "#6baf15",
  backgroundColor: "lightgrey"
};
const dropzoneInactiveStyle = {
  padding: "20px",
  width: "100%",
  height: "100%"
};

const actions = (handleSubmit, disabled) => [
  {
    key: "no",
    secondary: true,
    content: "Cancelar"
  },
  {
    key: "yes",
    primary: true,
    content: "Upload",
    onClick: handleSubmit,
    disabled
  }
];

const CoolHeader = ({ header, subHeader }) => (
  <Modal.Header>
    {header}
    {subHeader && <div className="subheader">{subHeader}</div>}
  </Modal.Header>
);
CoolHeader.propTypes = {
  header: PropTypes.any,
  subHeader: PropTypes.any
};

const getFormData = files =>
  files.reduce((acc, cur) => {
    acc.append("business_concepts", cur);
    return acc;
  }, new FormData());

export class UploadModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool,
    onOpen: PropTypes.func,
    icon: PropTypes.string,
    header: PropTypes.any,
    subHeader: PropTypes.any,
    content: PropTypes.any,
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    trigger: PropTypes.element,
    size: PropTypes.string,
    accept: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = { files: [], dropzoneActive: false };
    this.onDrop = this.onDrop.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
  }

  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  onDrop(files) {
    this.setState({
      files: [files[0]],
      dropzoneActive: false
    });
  }
  render() {
    const {
      open,
      onOpen,
      icon,
      header,
      subHeader,
      content,
      onClose,
      handleSubmit,
      trigger,
      size,
      accept
    } = this.props;
    const { dropzoneActive, files } = this.state;
    let dropzoneRef;

    return (
      <React.Fragment>
        <Modal
          icon={icon}
          open={open}
          onOpen={onOpen}
          onClose={onClose}
          actions={actions(() => {
            handleSubmit(getFormData(files));
            this.setState({ files: [] });
          }, files <= 0)}
          trigger={trigger}
          closeIcon
          size={size || "small"}
          header={<CoolHeader header={header} subHeader={subHeader} />}
          content={
            content.type === "string" ? (
              content
            ) : (
              <Modal.Content>
                <Dropzone
                  disableClick
                  accept={accept}
                  style={dropzoneActive ? dropzoneStyleHover : dropzoneStyle}
                  ref={node => {
                    dropzoneRef = node;
                  }}
                  onDrop={this.onDrop}
                  onDragEnter={this.onDragEnter}
                  onDragLeave={this.onDragLeave}
                >
                  <div
                    style={
                      dropzoneActive
                        ? dropzoneActiveStyle
                        : dropzoneInactiveStyle
                    }
                  >
                    <Container textAlign="center">
                      <Icon
                        name={dropzoneActive ? "download" : "cloud upload"}
                        size="huge"
                      />
                      <p>Subir</p>
                      <Button
                        secondary
                        icon="upload"
                        onClick={() => {
                          dropzoneRef.open();
                        }}
                        content="Upload file"
                      />
                    </Container>
                  </div>
                </Dropzone>
                <h2>
                  Ficheros
                </h2>
                <ul>
                  {files.map(f => (
                    <List
                      divided
                      verticalAlign="middle"
                      key={f.name}
                      size="big"
                    >
                      <List.Item key={f.name}>
                        <List.Content floated="right">
                          <Button
                            negative
                            icon="trash"
                            onClick={() => {
                              this.setState({ files: [] });
                            }}
                          />
                        </List.Content>
                        <Icon name="file alternate outline" size="big" />
                        <List.Content verticalAlign="middle">
                          {f.name} - {f.size} bytes
                        </List.Content>
                      </List.Item>
                    </List>
                  ))}
                </ul>
              </Modal.Content>
            )
          }
        />
      </React.Fragment>
    );
  }
}

export default UploadModal;
