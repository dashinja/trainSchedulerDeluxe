'use strict';
$(document).ready(function() {
  var config = {
    apiKey: 'AIzaSyDdMYWeKo1XSas-amzPoLcEYIDDhYu5iHY',
    authDomain: 'trainwatcher-4c0ad.firebaseapp.com',
    databaseURL: 'https://trainwatcher-4c0ad.firebaseio.com',
    projectId: 'trainwatcher-4c0ad',
    storageBucket: '',
    messagingSenderId: '825555381797'
  };
  firebase.initializeApp(config);

  let db = firebase.database();

  //Create appopriate HTML ✓
  //Load proper framworks: Bootstrap, jQuery, Moment.js, firebase ✓

  //JS File Starter ✓
  //Document.ready to enclose all ✓
  //JS File - load proper firebase config ✓
  // jQuery Hello World Test: ✓

  // declare a firebase helper variable ✓

  //Create event handler for clicking submit button ✓
  //have callback capture input into an object and send it to firebase ✓
  // Inputs needed from user and pushed to firebase ✓
  // Train Name ✓
  // Destination ✓
  // First Train Time (HH:mm - military time)
  // Frequency (min) ✓

  $('#submit-button').on('click', function(event) {
    event.preventDefault();

    let train = $('#train-input')
      .val()
      .trim();

    let destination = $('#destination-input')
      .val()
      .trim();

    let frequency = $('#frequency-input')
      .val()
      .trim();

    let arrivalTime = $('#arrival-input')
      .val()
      .trim();
    //Parse the moment and make it's layout like the given string, then format it to Unix seconds

    console.log(
      'Frequency capture:',
      frequency,
      'is it a string?:',
      typeof frequency
    );

    let newTrain = {
      train,
      destination,
      frequency,
      arrivalTime
    };

    db.ref('/').push(newTrain);

    $('#train-input').val('');
    $('#destination-input').val('');
    $('#frequency-input').val('');
    $('#arrival-input').val('');
    console.log('Successful FireBase Push:', newTrain);
  });

  //Create event handler for when child_added to firebase
  // receive snapshot of data and set value to variable
  // parse object for individual variables and set to display to DOM
  // Calculations needed:
  // Minutes away = (Next Arrival - Now)
  // Next arrival = Previous Arrival(first arrival sometimes) + frequency === moment(PreviousArrival).add(frequency, "minutes")
  // check his exercise: (01-Class-Content\07-firebase\01-Activities\21-TrainPredictions\train-example.html)

  //ACTUALLY
  // minutesAway = nextArrival - now === nextArrival - moment()

  db.ref('/').on('child_added', function(snap) {
    let theTrain = snap.val();
    let train = snap.val().train;
    let dest = snap.val().destination;
    let freq = parseInt(snap.val().frequency);
    let arrival = snap.val().arrivalTime;
    // let nextArrival = parseInt(arrival) + parseInt(freq);
    // let minutesAway = nextArrival - parseInt(moment());
    console.log('TRAIN:', train);
    console.log('Arrival:', arrival);

    //Arrival Time Pushed back a year to avoid negative number calculations
    let arrivalConverted = moment(arrival, 'HH:mm').subtract(1, 'years');
    console.log('ArrivalConvert:', arrivalConverted);

    // Current Time
    let timeNow = moment();
    console.log('Current Time:', moment(timeNow).format('hh:mm'));
    // let minutesAway2 = moment(nextArrival).subtract(moment(), 'm');

    // Time Elapsed between right now and First Arrival
    let diffTime = moment().diff(moment(arrivalConverted), 'minutes');
    console.log('Difference Between Now and First Arrival:', diffTime);

    console.log('Frequency', freq, 'Type:', typeof freq);

    // Time Apart (remainder)
    let tRemainder = diffTime % freq;
    console.log('tRemainder:', tRemainder);

    // Minutes Until Next Arrival

    let minutesTillTrain = freq - tRemainder;
    console.log("Minutes 'Till Train:", minutesTillTrain)

    let nextTrainArrival = moment().add(minutesTillTrain, "minutes")
    let nextTrainArrivalConverted = moment(nextTrainArrival).format("HH:mm A")
    console.log("Next Train Arrival:", moment(nextTrainArrival).format("HH:mm A"))

    // Minutes Remaining
    let firstTrainTime;

    // let tester = $('<td>').text(moment(minutesAway2, 'X').format('mm'));

    // console.log('typeof:', typeof tester, 'value:', tester);

    let newRow = $('<tr>');
    newRow.append(
      $('<td>').text(train),
      $('<td>').text(dest),
      $('<td>').text(freq),
      $('<td>').text(nextTrainArrivalConverted),
      $('<td>').text(minutesTillTrain)
      

    );

    $('#td-generate').append(newRow);
  });
});
