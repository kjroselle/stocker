// URL segments for Yahoo API
var baseYahooUrl = "http://query.yahooapis.com/v1/public/yql?q="
var UrlOptions = "&env=store://datatables.org/alltableswithkeys&format=json"

// test query for google stock
googJson = JSON.parse('{"query":{"count":1,"created":"2013-01-28T21:27:37Z","lang":"en-US","results":{"quote":{"symbol":"GOOG","LastTradePriceOnly":"750.73","Name":"Google Inc."}}}}');

// internal array to hold user stock info
// eventually integrate with localStorage
var stocksArray = new Array();

// HTML table element where the stocks are displayed
var stockTableElem;

$(document).ready(function(){
  // hide the add stock div when we start
  $("#addStock").hide();
});

// build the query to be sent to the Yahoo API to fetch stock info
function queryBuilder(symbols) {
  var query = "select symbol,Name,LastTradePriceOnly from yahoo.finance.quotes where"
  var numSymbols = symbols.length;
  for(var i = 0; i<numSymbols; i++) {
    query += " symbol in (\""+symbols[i]+"\")";
    // only add "or" for symbols except the last one
    if(i != numSymbols-1)
      query += " or";
  }
  query = encodeURIComponent(query);
  return query;
}

// Populates the div for adding a new stock to the stock list
function addStockDiv(stockJson) {
  $("#addStock").empty();
  
  // if the query is empty show 'No Results'
  if(stockJson.query.count == 0) {
    console.log("No Results");
    var noResults = 'No Results';
    $("#addStock").append(noResults);
    $("#addStock").show();
    return;
  }
  
  // populate HTML elements with Yahoo response results
  var stockName = stockJson.query.results.quote.Name;
  var stockTicker = stockJson.query.results.quote.symbol;
  var stockPrice = stockJson.query.results.quote.LastTradePriceOnly;
  
  var stockNameElement = document.createElement('div');
  stockNameElement.id = 'nameDiv';
  var tempElement = document.createElement('div');
  tempElement.className = 'ticker';
  tempElement.innerHTML = stockTicker;
  stockNameElement.appendChild(tempElement);
  var tempElement = document.createElement('div');
  tempElement.className = 'name';
  tempElement.innerHTML = stockName;
  stockNameElement.appendChild(tempElement);
  
  var stockPriceElement = document.createElement('span');
  stockPriceElement.innerHTML = stockPrice;
  var buyFieldElement = '<input type="text" class="addIn" \
    id="buytext" placeholder="Buy Price">';
  var sellFieldElement = '<input type="text" class="addIn" \
    id="selltext" placeholder="Sell Price">';
  var addButtonElement = '<button id="addButton">Add</button>';
  
  $("#addStock").append(stockNameElement, stockPriceElement, 
    buyFieldElement, sellFieldElement, addButtonElement);
  
  $("#addStock").show();
  
  // add handler for button to add the stock to the stock list
  // need to make an anonymous function in order to pass in arguments
  document.querySelector('button#addButton').addEventListener('click', 
    function() {
      addStockButtonHandler(stockNameElement.cloneNode(true), stockPriceElement.cloneNode(true));
    });
}

function changeImage() {
  document.images["addButtonImg"].src= "res/del.png";
  return true;
}

// send query to Yahoo and handle response
function getSiteJson(queryUrl) {
  var request = new XMLHttpRequest();
  request.open("GET", queryUrl, true);
  console.log(queryUrl);
  console.log(request);
  // asynchronous call handler
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      if (request.status == 200) {
        console.log(request.responseText);
        var jsonResponse = JSON.parse(request.responseText);
        addStockDiv(jsonResponse);
      } else {
        console.log('Unable to resolve address');
      }
    }
  };
  request.send(null);
}

function searchButtonHandler() {
  var stockSymbol = [document.getElementById("searchtext").value];
  var query = queryBuilder(stockSymbol);
  console.log(stockSymbol);
  console.log(query);
  var queryUrl = baseYahooUrl+query+UrlOptions;
  console.log(queryUrl);
  getSiteJson(queryUrl);
  console.log("done search");
}

function delStockButtonHandler(elem, row) {
  var rowIndex = row.rowIndex;
  // update internal stocks array and
  // HTML table
  stocksArray.splice(rowIndex,1);
  stockTableElem.deleteRow(rowIndex);
}

function addStockButtonHandler(name, price) {
  var buyPrice = document.getElementById("buytext").value;
  var sellPrice = document.getElementById("selltext").value;
  var buyPriceElement = document.createElement('span');
  buyPriceElement.innerHTML = buyPrice;
  var sellPriceElement = document.createElement('span');
  sellPriceElement.innerHTML = sellPrice;
  var delButtonElement = document.createElement('button');
  delButtonElement.id = 'delButton';
  delButtonElement.innerHTML = 'Del';
  
  // object to store newly added stock data
  var stockEntry = new Object();
  stockEntry.name = name.firstChild.innerHTML;
  stockEntry.ticker = name.lastChild.innerHTML;
  stockEntry.price = price.innerHTML;
  stockEntry.sellPrice = sellPrice;
  stockEntry.buyPrice = buyPrice;
  
  stocksArray.unshift(stockEntry);
  
  console.log(stockEntry.name + " " + stockEntry.ticker+ " " +stockEntry.price);
  
  // construct HTML table entry
  var rowDelElement = document.createElement('button');
  rowDelElement.innerHTML = "Del";
  
  var newRow = stockTableElem.insertRow(0);
  
  console.log(name);
  
  var newCell = newRow.insertCell(0);
  newCell.appendChild(name);
  newCell = newRow.insertCell(-1);
  newCell.appendChild(price);
  newCell = newRow.insertCell(-1);
  newCell.appendChild(buyPriceElement);
  newCell = newRow.insertCell(-1);
  newCell.appendChild(sellPriceElement);
  
  var cell0 = newRow.insertCell(-1);
  cell0.appendChild(rowDelElement);
  
  rowDelElement.addEventListener('click',
    function() {
      delStockButtonHandler(rowDelElement, newRow);
  });
  
}

// listen for when the document is fully loaded then add
// search button listener and get reference to table element
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button#searchButton').addEventListener('click', searchButtonHandler);
  stockTableElem = document.getElementById("stockTable");
});