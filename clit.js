/*
clit - v1.0.5

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

Please refer to README.md to see what this is about.
*/

var running = true;
var lastMeasure = Date.now ();
var accumulated = 0;

function log (log) {
   // This ANSI sequence cleans the screen.
   process.stdout.write ('\u001B[2J\u001B[0;0f');
   process.stdout.write ('Timer started. Press CTRL+Z to pause/resume and CTRL+C to quit.\n');
   process.stdout.write (log);
}

function timeFormat (milliseconds) {
    var x;

    x = milliseconds / 1000;
    var seconds = Math.floor (x % 60);

    x /= 60;
    var minutes = Math.floor (x % 60);

    x /= 60;
    var hours = Math.floor (x % 24);

    var output = '';

    output = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);

    if (hours) {
       output = hours + ':' + output;
    }
    return output;
}

function timerFunction () {
   var now = Date.now ();
   accumulated += now - lastMeasure;
   lastMeasure = now;
   log (timeFormat (accumulated));
}

var pause = setInterval (function () {}, 1000);
var timer = setInterval (timerFunction, 1000);

process.on ('SIGTSTP', function () {
   if (running) {
      timerFunction ();
      clearInterval (timer);
      running = false;
      log ('Paused at ' + timeFormat (accumulated));
   }
   else {
      lastMeasure = Date.now ();
      timer = setInterval (timerFunction, 1000);
      running = true;
      log ('Resumed at ' + timeFormat (accumulated));
   }
});

process.on ('SIGINT', function () {
   log ('Stopped after ' + timeFormat (accumulated));
   process.stdout.write ('\n');
   process.exit ();
});
