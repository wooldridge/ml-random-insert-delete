var config = require('./config'),
    marklogic = require('marklogic');

var db,
    duration,
    d,
    currTime,
    currFmt,
    endTime,
    pause,
    query,
    setTimes,
    showTimes,
    insertDoc,
    deleteDoc,
    run,
    rnd;

db = marklogic.createDatabaseClient(config.marklogic);

duration = parseInt(process.argv[2]); // time to run in seconds

setTimes = function () {
  d = new Date();
  currTime = Math.floor(d.getTime() / 1000);
  currFmt =
    d.getFullYear() +'-'+
    ('0' + (d.getMonth()+1)).slice(-2) +'-'+
    ('0' + d.getDate()).slice(-2) + '_' +
    ('0' + d.getHours()).slice(-2) + '-' +
    ('0' + d.getMinutes()).slice(-2) + '-' +
    ('0' + d.getSeconds()).slice(-2);
  pause = Math.round(
            (config.pause +
            (config.padding * (Math.random() - 0.5))) * 1000
          );
}

showTimes = function () {
  console.log('Current Time:   ' + currFmt);
  console.log('Secs until end: ' + (endTime - currTime));
  console.log('Next pause:     ' + pause/1000);
}

insertDoc = function (uri) {
  db.documents.write({
    uri: uri,
    content: { data: uri },
    collections: ['docs']
  }).result(
    function(response) {
      response.documents.forEach( function(document) {
        console.log('Inserted:       ' + document.uri);
      });
    },
    function(error) {
      console.log(JSON.stringify(error, null, 2));
    }
  );
}

deleteDoc = function () {
  q = marklogic.queryBuilder;
  db.documents.query(
    q.where(
      q.collection('docs')
    ).slice(1, 1)
  ).result(
    function(response) {
      if (response.length > 0) {
        response.forEach( function(document) {
          db.documents.remove({
            uri: document.uri
          }).result(
            function(response) {
              console.log('Deleted:        ' + response.uri);
            },
            function(error) {
              console.log(JSON.stringify(error, null, 2));
            }
          );
        });
      }
    },
    function(error) {
      console.log(JSON.stringify(error, null, 2));
    }
  );
}

run = function () {
  setTimeout(function(){
    if (currTime > endTime) {
      process.exit();
    } else {
      showTimes();
      rnd = Math.random();
      if (rnd < config.ratio) {
        insertDoc(currFmt + '.json');
      } else {
        deleteDoc();
      }
      setTimes();
      run();
    }
  }, pause);
}

setTimes();
endTime = currTime + duration;
run();
