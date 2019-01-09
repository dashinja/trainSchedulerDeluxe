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

  //Create event handler for clicking submit button
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

    let frequency = moment(
      $('#frequency-input')
        .val()
        .trim(),
      'mm'
    ).format('X');

    let arrivalTime = moment(
      $('#arrival-input')
        .val()
        .trim(),
      'HH:mm'
    ).format('X'); //Parse the moment and make it's layout like the given string, then format it to Unix seconds

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

  //ACTUALLY
  // minutesAway = nextArrival - now === nextArrival - moment()

  db.ref('/').on('child_added', function(snap) {
    let theTrain = snap.val();
    let train = snap.val().train;
    let dest = snap.val().destination;
    let freq = snap.val().frequency;
    let arrival = snap.val().arrivalTime;
    let nextArrival = parseInt(arrival) + parseInt(freq);
    let minutesAway = nextArrival - parseInt(moment());
    let currentTime = moment().format("X");
    console.log("Current Time:", currentTime)
    let minutesAway2 = moment(nextArrival)
      .subtract(moment(), 'm')
    console.log(
      'Second MinutesAway:',
      minutesAway2,
      'Type of NextArrival:',
      typeof minutesAway2
    );
    console.log(
      'Next Arrival:',
      nextArrival,
      'Type of NextArrival:',
      typeof nextArrival
    );
    console.log(
      'minutesAway:',
      nextArrival,
      'Type of minutesAway:',
      typeof nextArrival
    );

    let tester = $('<td>').text(
      moment(minutesAway2, 'X').format('mm')
      );

      console.log("typeof:", typeof tester, "value:", tester)

    let newRow = $('<tr>');
    newRow.append(
      $('<td>').text(train),
      $('<td>').text(dest),
      $('<td>').text(moment(freq, 'X').format('mm')),
      $('<td>').text(moment(arrival, 'X').format('HH:mm A')),
      tester
      // $('<td>').text(moment(minutesAway2.toString(), 'X').format('mm'))
    );

    $('#td-generate').append(newRow);
  });
});
