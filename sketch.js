// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ML5 Example
KNN_Image
KNN Image Classifier example with p5.js
=== */

let knn;

class CameraRecognizer {
  constructor(video, callback, classes, facingMode) {
    this.callback = callback;
    this.classes = classes;

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: facingMode || 'user',
        },
        audio: false,
      })
      .then(stream => {
        video.srcObject = stream;
      })
      .catch(() => {
        this.callback.onInitialized(false);
      });
    knn = new ml5.KNNImageClassifier(
      classes || 3,
      1,
      this.modelLoaded.bind(this),
      video
    );
  }

  // A to be called when the model has been loaded
  modelLoaded() {
    this.callback.onInitialized(true);
  }

  // Train the Classifier on a frame from the video.
  train(category) {
    knn.addImageFromVideo(category);
    this.callback.onTrainCompleted();
  }

  // Predict the current frame.
  predict() {
    knn.predictFromVideo(this.gotResults.bind(this));
  }

  // Show the results
  gotResults(results) {
    this.callback.onRecognizeResult(results.classIndex);

    setTimeout(() => {
      this.predict();
    }, 50);
  }

  // Clear the data in one class
  clearClass(classIndex) {
    knn.clearClass(classIndex);
  }

  save() {
    knn.save();
  }

  load() {
    knn.load(this.callback.onTrainCompleted);
  }

  getClassExampleCount() {
    return knn.getClassExampleCount();
  }
}
