// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
(
	function Motion() {
	let video = document.querySelector("#webcam") 

	let webcamError = function(e) {
		alert('Webcam error!', e);
	};

	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({video: true}).then(function(stream) {
			video?.srcObject = stream;
			initialize();
		}, webcamError);
	} else if (navigator.getUserMedia) {
		navigator.getUserMedia({video: true}, function(stream) {
			video.srcObject = stream;
			initialize();
		}, webcamError);
	} else if (navigator.webkitGetUserMedia) {
		navigator.webkitGetUserMedia({video:true}, function(stream) {
			video.srcObject = window.webkitURL.createObjectURL(stream);
			initialize();
		}, webcamError);
	} 

	let lastImageData;
	let canvasSource = document.querySelector("#canvas-source") //$("#canvas-source")[0];
	let canvasBlended = document.querySelector("#canvas-blended") //$("#canvas-blended")[0];

	let contextSource = canvasSource.getContext('2d');
	let contextBlended = canvasBlended.getContext('2d');
	let notes = [];

	contextSource.translate(canvasSource.width, 0);
	contextSource.scale(-1, 1);

	function initialize() {
		setTimeout(finishedLoading, 1000);
	}

	function finishedLoading() {
		for (let i=0; i<3; i++) {
			let note = {
				ready: true,
				visual: i
			};
			notes.push(note);
		}
		start();
	}

	function playMotion(obj) {
		if (!obj.ready) return;
		
		let key = obj.visual

		if (key == 1) {
			console.log('왼쪽으로 넘기기')
			leftButton.click();
		}

		if (key == 2) {
			console.log('오른쪽으로 넘기기')
			rightButton.click()
		}

		if (key == 0) {
			console.log('선택하기')
		}

		obj.ready = false;
		
		setTimeout(setNoteReady, 600, obj);
	}

	function setNoteReady(obj) {
		obj.ready = true;
	}

	function start() {
		update();
	}

	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	function update() {
		drawVideo();
		blend();
		checkAreas();
		requestAnimFrame(update);
	}

	function drawVideo() {
		contextSource.drawImage(video, 0, 0, video.width, video.height);
	}

	function blend() {
		let width = canvasSource.width;
		let height = canvasSource.height;
		let sourceData = contextSource.getImageData(0, 0, width, height);
		if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height);
		let blendedData = contextSource.createImageData(width, height)
		differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
		contextBlended.putImageData(blendedData, 0, 0);
		lastImageData = sourceData;
	}

	function fastAbs(value) {
		return (value ^ (value >> 31)) - (value >> 31);
	}

	function threshold(value) {
		return (value > 0x15) ? 0xFF : 0;
	}

	function differenceAccuracy(target, data1, data2) {
		if (data1.length != data2.length) return null;
		let i = 0;
		while (i < (data1.length * 0.25)) {
			let average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
			let average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
			let diff = threshold(fastAbs(average1 - average2));
			target[4*i] = diff;
			target[4*i+1] = diff;
			target[4*i+2] = diff;
			target[4*i+3] = 0xFF;
			++i;
		}
	}

	function checkAreas() {
		let areas = [
			{ x: video.width * 0.5, y: 300, width: 30, height: 30 }, 
			{ x: 300, y: video.height * 0.5, width: 30, height: 30 }, 
			{ x: video.width - 300, y: video.height * 0.5, width: 10, height: 10 } 
		];
		
		areas.forEach((area, index) => {
			let blendedData = contextBlended.getImageData(area.x, area.y, area.width, area.height);
			let i = 0;
			let average = 0;
			let pixelCount = blendedData.data.length / 4;
	
			while (i < pixelCount) {
				let offset = i * 4;
				average += (blendedData.data[offset] + blendedData.data[offset + 1] + blendedData.data[offset + 2]) / 3;
				++i;
			}
	
			average = Math.round(average / pixelCount);
	
			if (average > 80) {
				playMotion(notes[index]); 
				
			}
		});
	}
	
})();


