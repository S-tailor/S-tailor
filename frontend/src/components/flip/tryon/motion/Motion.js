/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

export default function () {
  var video = document.querySelector('#webcam') //$('#webcam')[0];

  var webcamError = function (e) {
    alert('Webcam error!', e)
  }

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
      video.srcObject = stream
      initialize()
    }, webcamError)
  } else if (navigator.getUserMedia) {
    navigator.getUserMedia(
      { video: true },
      function (stream) {
        video.srcObject = stream
        initialize()
      },
      webcamError
    )
  } else if (navigator.webkitGetUserMedia) {
    navigator.webkitGetUserMedia(
      { video: true },
      function (stream) {
        video.srcObject = window.webkitURL.createObjectURL(stream)
        initialize()
      },
      webcamError
    )
  } else {
    //video.src = 'somevideo.webm'; // fallback.
  }

  var lastImageData
  var canvasSource = document.querySelector('#canvas-source') //$("#canvas-source")[0];
  var canvasBlended = document.querySelector('#canvas-blended') //$("#canvas-blended")[0];

  var contextSource = canvasSource.getContext('2d')
  var contextBlended = canvasBlended.getContext('2d')

  var notes = []

  contextSource.translate(canvasSource.width, 0)
  contextSource.scale(-1, 1)

  var c = 5

  function initialize() {
    setTimeout(finishedLoading, 1000)
  }

  function finishedLoading(bufferList) {
    for (var i = 0; i < 3; i++) {
      var note = {
        ready: true,
        visual: i
      }
      notes.push(note)
    }
    start()
  }

  function playSound(obj) {
    if (!obj.ready) return

    let key = obj.visual

    if (key == 1) {
      console.log('왼쪽으로 넘기기')
      //leftButton.click();
    }

    if (key == 2) {
      console.log('오른쪽으로 넘기기')
      //rightButton.click()
    }

    if (key == 0) {
      console.log('선택하기')
    }

    obj.ready = false

    setTimeout(setNoteReady, 600, obj)
  }

  function setNoteReady(obj) {
    obj.ready = true
  }

  function start() {
    update()
  }

  window.requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60)
      }
    )
  })()

  function update() {
    drawVideo()
    blend()
    checkAreas()
    requestAnimFrame(update)
  }

  function drawVideo() {
    contextSource.drawImage(video, 0, 0, video.width, video.height)
  }

  function blend() {
    var width = canvasSource.width
    var height = canvasSource.height
    // get webcam image data
    var sourceData = contextSource.getImageData(0, 0, width, height)
    // create an image if the previous image doesn’t exist
    if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height)
    // create a ImageData instance to receive the blended result
    var blendedData = contextSource.createImageData(width, height)
    // blend the 2 images
    differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data)
    // draw the result in a canvas
    contextBlended.putImageData(blendedData, 0, 0)
    // store the current webcam image
    lastImageData = sourceData
  }

  function fastAbs(value) {
    // funky bitwise, equal Math.abs
    return (value ^ (value >> 31)) - (value >> 31)
  }

  function threshold(value) {
    return value > 0x15 ? 0xff : 0
  }

  function differenceAccuracy(target, data1, data2) {
    if (data1.length != data2.length) return null
    var i = 0
    while (i < data1.length * 0.25) {
      var average1 = (data1[4 * i] + data1[4 * i + 1] + data1[4 * i + 2]) / 3
      var average2 = (data2[4 * i] + data2[4 * i + 1] + data2[4 * i + 2]) / 3
      var diff = threshold(fastAbs(average1 - average2))
      target[4 * i] = diff
      target[4 * i + 1] = diff
      target[4 * i + 2] = diff
      target[4 * i + 3] = 0xff
      ++i
    }
  }

  function checkAreas() {
    var areas = [
      { x: video.width * 0.5, y: 300, width: 30, height: 30 },
      { x: 300, y: video.height * 0.5, width: 30, height: 30 },
      { x: video.width - 300, y: video.height * 0.5, width: 10, height: 10 }
    ]

    areas.forEach((area, index) => {
      var blendedData = contextBlended.getImageData(area.x, area.y, area.width, area.height)
      var i = 0
      var average = 0
      var pixelCount = blendedData.data.length / 4

      // Loop over the pixels to calculate the average intensity in the area
      while (i < pixelCount) {
        var offset = i * 4
        average +=
          (blendedData.data[offset] + blendedData.data[offset + 1] + blendedData.data[offset + 2]) /
          3
        ++i
      }

      average = Math.round(average / pixelCount)

      if (average > 80) {
        // If the average intensity is over the threshold, consider movement detected

        playSound(notes[index]) // Play sound assigned to this area
      }
    })
  }
}
