import * as React from 'react'

export class WebcamStream extends React.Component {
    constructor(props) {
        super(props);
        this.videoTag = React.createRef()
    }

    componentDidMount() {
    // getting access to webcam
    //    navigator.mediaDevices
    //         .getUserMedia({video: true})
    //         .then(stream => this.videoTag.current.srcObject = stream)
    //         .catch(console.log);
        this.videoTag.current.srcObject = props.frame
    }

    render() {
        return <video id={this.props.id}
                      ref={this.videoTag}
                      width={this.props.width}
                      height={this.props.height}
                      autoPlay
                      title={this.props.title}></video>
    }
}