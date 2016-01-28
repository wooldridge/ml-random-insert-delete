var config = require('./config'),
    marklogic = require('marklogic');

var db,
    duration,
    currTime,
    endTime,
    pause,
    query,
    setTimes,
    showTimes,
    insertDoc,
    deleteDoc,
    getDoc;

db = marklogic.createDatabaseClient(config.marklogic);

duration = parseInt(process.argv[2]); // time to run in seconds

setTimes = function () {
  currTime = Math.floor(Date.now() / 1000);
  pause = Math.round(Math.random() * 10000);
}

showTimes = function () {
  console.log('currTime: ' + currTime);
  console.log('secs until end: ' + (endTime - currTime));
  console.log('pause: ' + pause);
}

insertDoc = function (uri) {
  db.documents.write({
    uri: uri,
    content: { data: uri },
    collections: ['docs']
  }).result(
    function(response) {
      response.documents.forEach( function(document) {
        console.log('Inserted:  ' + document.uri);
      });
    },
    function(error) {
      console.log(JSON.stringify(error, null, 2));
    }
  );
}

deleteDoc = function (uri) {
  db.documents.remove({
    uri: uri
  }).result(
    function(response) {
      console.log('Deleted:  ' + response.uri);
    },
    function(error) {
      console.log(JSON.stringify(error, null, 2));
    }
  );
}

getDoc = function (callback) {
  q = marklogic.queryBuilder;
  db.documents.query(
    q.where(
      q.collection('docs')
    ).slice(1, 1)
  ).result(
    function(response) {
      if (response.length > 0) {
        response.forEach( function(document) {
          callback(document.uri);
        });
      }
    },
    function(error) {
      console.log(JSON.stringify(error, null, 2));
    }
  );
}

function run() {
  if ((pause % 2) == 1) {
    insertDoc(currTime + '.json');
  } else {
    getDoc(deleteDoc);
  }
  setTimeout(function(){
    if (currTime > endTime) {
      process.exit();
    } else {
      setTimes();
      showTimes();
      run();
    }
  }, pause);
}

setTimes();
endTime = currTime + duration;
run();
