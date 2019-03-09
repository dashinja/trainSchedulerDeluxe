'use strict'
$(document).ready(function() {
  var config = {
    apiKey: 'AIzaSyDdMYWeKo1XSas-amzPoLcEYIDDhYu5iHY',
    authDomain: 'trainwatcher-4c0ad.firebaseapp.com',
    databaseURL: 'https://trainwatcher-4c0ad.firebaseio.com',
    projectId: 'trainwatcher-4c0ad',
    storageBucket: '',
    messagingSenderId: '825555381797'
  }
  firebase.initializeApp(config)

  let db = firebase.database()

  $.validate({
    modules: 'toggleDisabled, sanitize',
    disabledFormFilter: 'form.toggle-disabled',
    showErrorDialogs: true
  })

  let realCounter = 0

  $('#submit-button').on('click', function(event) {
    event.preventDefault()
    realCounter =+ 1

    let train = $('#train-input')
      .val()
      .trim()

    let destination = $('#destination-input')
      .val()
      .trim()

    let frequency = $('#frequency-input')
      .val()
      .trim()

    let arrivalTime = $('#arrival-input')
      .val()
      .trim()


    let newTrain = {
      train,
      destination,
      frequency,
      arrivalTime,
      realCounter
    }

    db.ref('/').push(newTrain)

    $('#train-input').val('')
    $('#destination-input').val('')
    $('#frequency-input').val('')
    $('#arrival-input').val('')
  })

  db.ref('/').on('child_added', function(snap) {
    let theTrain = snap.val()
    let train = snap.val().train
    let dest = snap.val().destination
    let freq = parseInt(snap.val().frequency)
    let arrival = snap.val().arrivalTime
    let theCount = snap.val().realCounter

    function renderCalc() {
      //Arrival Time Pushed back a year to avoid negative number calculations
      let arrivalConverted = moment(arrival, 'HH:mm').subtract(1, 'years')

      // Current Time
      let timeNow = moment()

      // Time Elapsed between right now and First Arrival
      let diffTime = moment().diff(moment(arrivalConverted), 'minutes')


      // Time Apart (remainder)
      let tRemainder = diffTime % freq

      // Minutes Until Next Arrival

      let minutesTillTrain = freq - tRemainder

      let nextTrainArrival = moment().add(minutesTillTrain, 'minutes')
      let nextTrainArrivalConverted = moment(nextTrainArrival).format('HH:mm A')

      let answers = {
        nextArrival: nextTrainArrivalConverted,
        minutesAway: minutesTillTrain
      }
      return answers
    }

    let newRow = $('<tr>')
    function renderData() {
      newRow.append(
        $('<td>').text(train),
        $('<td>').text(dest),
        $('<td>').text(freq),
        $('<td>')
          .attr('id', 'calc-arrival')
          .attr('class', 'recalc-arrival')
          .attr('data-arrival', theCount)
          .text(renderCalc().nextArrival),
        $('<td>')
          .attr('id', 'calc-away')
          .attr('class', 'recalc-away')
          .attr('data-away', theCount)
          .text(renderCalc().minutesAway)
      )
    }
    renderData()

    $('#td-generate').append(newRow)
  })
})
