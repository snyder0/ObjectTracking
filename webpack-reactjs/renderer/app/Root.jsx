import * as React from 'react'
import WebcamStream from './WebcamStream'

import { grabFrames, drawRectAroundBlobs } from './utils';
import cv from 'opencv4nodejs';
import path from 'path';

export default class Root extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      image: null
    }
  }

  renderImage() {
    let img = this.state.image
    const { canvas } = this
    const matRGBA = img.channels === 1
      ? img.cvtColor(cv.COLOR_GRAY2RGBA)
      : img.cvtColor(cv.COLOR_BGR2RGBA)

    canvas.height = img.rows
    canvas.width = img.cols
    const imgData = new ImageData(
      new Uint8ClampedArray(matRGBA.getData()),
      img.cols,
      img.rows
    );
    const ctx = canvas.getContext('2d')
    ctx.putImageData(imgData, 0, 0)
  }

  componentDidMount() {
    const img = cv.imread(path.resolve('assets', 'got.jpg')).resizeToMax(500)
    this.trackObjects()
  }

  componentDidUpdate() {
    this.renderImage()
  }

  trackObjects = () => {
    const delay = 1000;
    grabFrames(path.resolve('assets', 'horses.mp4'), delay, this.setFrame);
  }

  setFrame = (frame) => {
    const frameHLS = frame.cvtColor(cv.COLOR_BGR2HLS);

    const brownUpper = new cv.Vec(10, 60, 165);
    const brownLower = new cv.Vec(5, 20, 100);
    const rangeMask = frameHLS.inRange(brownLower, brownUpper);

    const blurred = rangeMask.blur(new cv.Size(10, 10));
    const thresholded = blurred.threshold(100, 255, cv.THRESH_BINARY);

    const minPxSize = 400;
    const fixedRectWidth = 100;
    drawRectAroundBlobs(thresholded, frame, minPxSize, fixedRectWidth);

    this.setState({
      image: frame
    })
  }

  render() {
    return (
      <div>
        <h1> Electron and OpenCV </h1>
        <canvas ref={el => { this.canvas = el }}></canvas>
      </div>
    )
  }
}
