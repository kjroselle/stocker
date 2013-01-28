
var baseYahooUrl = "http://query.yahooapis.com/v1/public/yql?q="
var UrlOptions = "&env=store://datatables.org/alltableswithkeys&format=json"
//http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22MSFT%22)&env=store://datatables.org/alltableswithkeys&format=json
//http://query.yahooapis.com/v1/public/yql?q=select%20symbol,LastTradePriceOnly%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22MSFT%22)%20or%20symbol%20in%20(%22GOOG%22)&env=store://datatables.org/alltableswithkeys&format=json

function queryBuilder(symbols) {
  var query = "select symbol,LastTradePriceOnly from yahoo.finance.quotes where"
  for(var i = 0; i<symbols.length; i++) {
    query += " symbol in (\""+symbols[i]+"\") or"
  }
  // get rid of the last %20or
  query = query.slice(0,-3)
  query = encodeURIComponent(query);
  return query;
}

function getSite(queryUrl) {
  var request = new XMLHttpRequest();
  request.open("GET", queryUrl, true);
  console.log(queryUrl);
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      if (request.status == 200) {
        console.log(request);
        console.log(request.responseText);
        var json = JSON.parse(request.responseText);
      } else {
        console.log(request);
        console.log(request.responseText);
        console.log('Unable to resolve address');
      }
    }
  };
  request.send(null);
}

function search() {
  // var text = document.search.searchtext.value;
  var stockSymbol = [document.getElementById("searchtext").value];
  var query = queryBuilder(stockSymbol);
  console.log(stockSymbol);
  console.log(query);
  var queryUrl = baseYahooUrl+query+UrlOptions;
  console.log(queryUrl);
  // $.get(queryUrl, function(data,status) {
    // var response = data;
    // console.log(response);
    // console.log(data.query.results.item);
    // alert('Load was performed.');
  // });
  getSite(queryUrl);
  // console.log("Trying google...:");
  // getSite("http://www.google.com");
  console.log("done search");
  // loadXMLDoc(queryUrl);
  // alert(stockSymbol);
}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button#searchButton').addEventListener('click', search);
  // main();
});