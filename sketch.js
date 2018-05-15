// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ML5 Example
KNN_Image
KNN Image Classifier example with p5.js
=== */

const CLASSES = 3;

let knn;
let video;

const facingMode = localStorage.getItem('facingMode') || 'user';

function setup() {
  noCanvas();
  // Create a KNN Image Classifier
  video = createCapture({
    video: { facingMode: facingMode },
    audio: false,
  }).parent('videoContainer');
  knn = new ml5.KNNImageClassifier(CLASSES, 1, modelLoaded, video.elt);
  createButtons();
}

function createButtons() {
  // Switch Camera button
  switchCamera = select('#switchCamera');
  switchCamera.mousePressed(function() {
    if (
      confirm('Switch camera needs refresh page.\nDo you realy want to switch?')
    ) {
      localStorage.setItem(
        'facingMode',
        localStorage.getItem('facingMode') === 'environment'
          ? 'user'
          : 'environment'
      );
      location.reload();
    }
  });

  // Save and Load buttons
  save = select('#save');
  save.mousePressed(function() {
    knn.save();
  });

  load = select('#load');
  load.mousePressed(function() {
    knn.load(updateExampleCounts);
  });

  const buttonBlock = document.getElementById('buttonBlock');
  for (let i = 1; i <= CLASSES; i++) {
    // Train buttons
    const btn = document.createElement('button');
    btn.textContent = `Train ${i}`;
    buttonBlock.appendChild(btn);
    btn.addEventListener('mousedown', () => {
      train(i);
    });

    // Reset buttons
    const resetBtn = document.createElement('button');
    resetBtn.textContent = `Reset ${i}`;
    buttonBlock.appendChild(resetBtn);
    resetBtn.addEventListener('mousedown', () => {
      clearClass(i);
      updateExampleCounts();
    });

    const example = document.createElement('span');
    example.id = `example${i}`;
    example.textContent = '0';
    const exampleContainer = document.createElement('p');
    exampleContainer.appendChild(example);
    exampleContainer.insertAdjacentHTML('beforeend', ` Examples in ${i}<br>`);
    buttonBlock.appendChild(exampleContainer);
  }

  // Predict Button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(predict);
}

// A function to be called when the model has been loaded
function modelLoaded() {
  select('#loading').html('Model loaded!');
}

// Train the Classifier on a frame from the video.
function train(category) {
  select('#training').html(category);
  knn.addImageFromVideo(category);
  updateExampleCounts();
}

// Predict the current frame.
function predict() {
  knn.predictFromVideo(gotResults);
}

// Show the results
function gotResults(results) {
  select('#result').html(results.classIndex);

  setTimeout(function() {
    predict();
  }, 50);
}

// Clear the data in one class
function clearClass(classIndex) {
  knn.clearClass(classIndex);
}

// Update the example count for each class
function updateExampleCounts() {
  let counts = knn.getClassExampleCount();
  for (let i = 1; i <= CLASSES; i++) {
    select(`#example${i}`).html(counts[i]);
  }
}
