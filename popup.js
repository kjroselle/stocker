
var baseYahooUrl = "http://query.yahooapis.com/v1/public/yql?q="
var UrlOptions = "&env=store://datatables.org/alltableswithkeys&format=json"
//http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22MSFT%22)&env=store://datatables.org/alltableswithkeys&format=json
//http://query.yahooapis.com/v1/public/yql?q=select%20symbol,LastTradePriceOnly%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22MSFT%22)%20or%20symbol%20in%20(%22GOOG%22)&env=store://datatables.org/alltableswithkeys&format=json

//http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=yahoo&callback=YAHOO.Finance.SymbolSuggest.ssCallback
googJson = JSON.parse('{"query":{"count":1,"created":"2013-01-28T21:27:37Z","lang":"en-US","results":{"quote":{"symbol":"GOOG","LastTradePriceOnly":"750.73","Name":"Google Inc."}}}}');

var stocksArray;
var stockTableElem;

$(document).ready(function(){

  $("#addStock").hide();
});

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

// Populates the div for adding a new stock
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
  
  var stockName = stockJson.query.results.quote.Name;
  var stockTicker = stockJson.query.results.quote.symbol;
  var stockPrice = stockJson.query.results.quote.LastTradePriceOnly;
  
  var stockNameElement = 
    '<div id="nameDiv"><div class="ticker">'+stockTicker+'</div>'+
    '<div class="name">'+stockName+'</div>'+'</div>';
  var stockPriceElement = '<span>'+stockPrice+'</span>';
  var buyFieldElement = '<input type="text" class="addIn" \
    id="buytext" placeholder="Buy Price">';
  var sellFieldElement = '<input type="text" class="addIn" \
    id="selltext" placeholder="Sell Price">';
  var addButtonElement = '<button id="addButton">Add</button>';
  
  
  // var addButtonImgElement = '<a href="#" onMouseOver="changeImage()"><img name="addButtonImg" src="res/add.png" width="22" height="22" border="0" alt="javascript button"></a>';
  
  $("#addStock").append(stockNameElement, stockPriceElement, 
    buyFieldElement, sellFieldElement, addButtonElement);
  
  $("#addStock").show();
  
  // need to make an anonymous function in order to pass in arguments
  document.querySelector('button#addButton').addEventListener('click', 
    function() {
      addStockButtonHandler(stockNameElement, stockPriceElement);
    });
}

function changeImage() {
  document.images["addButtonImg"].src= "res/del.png";
  return true;
}

function getSite(queryUrl) {
  var request = new XMLHttpRequest();
  request.open("GET", queryUrl, true);
  console.log(queryUrl);
  console.log(request);
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

function search() {
  // var text = document.search.searchtext.value;
  var stockSymbol = [document.getElementById("searchtext").value];
  var query = queryBuilder(stockSymbol);
  console.log(stockSymbol);
  console.log(query);
  var queryUrl = baseYahooUrl+query+UrlOptions;
  console.log(queryUrl);
  // getSite(queryUrl);
  addStockDiv(googJson);
  console.log("done search");
}

function delStockButtonHandler(elem, row) {
  var rowIndex = row.rowIndex;
  stockTableElem.deleteRow(rowIndex);
  // rowIndex = elem.parentNode.parentNode.rowIndex;
  // stockTableElem.deleteRow(rowIndex);
  // alert('delete ' + rowIndex);
}

function addStockButtonHandler(name, price) {
  var buyPrice = [document.getElementById("buytext").value];
  var sellPrice = [document.getElementById("selltext").value];
  var buyPriceElement = '<span>'+buyPrice+'</span>';
  var sellPriceElement = '<span>'+sellPrice+'</span>';
  var delButtonElement = '<button id="delButton">Del</button>';
  var stockElement = '<div class=stockEntry>'+name+price+buyPriceElement+sellPriceElement+delButtonElement+'</div>';
  $("#stocks").append(stockElement);
  
  var rowDelElement = document.createElement('button');
  rowDelElement.innerHTML = "Del";
  
  var newRow = stockTableElem.insertRow(0);
  
  console.log(name);
  
  var newCell = newRow.insertCell(0);
  newCell.appendChild(name);
  // newCell = newRow.insertCell(-1);
  // newCell.appendChild(price);
  // newCell = newRow.insertCell(-1);
  // newCell.appendChild(buyPriceElement);
  // newCell = newRow.insertCell(-1);
  // newCell.appendChild(sellPriceElement);
  var cell1 = newRow.insertCell(0);
  cell1.innerHTML = "New";
  var cell2 = newRow.insertCell(0);
  cell2.innerHTML = "New";
  
  var cell0 = newRow.insertCell(-1);
  cell0.appendChild(rowDelElement);
  
  rowDelElement.addEventListener('click',
    function() {
      delStockButtonHandler(rowDelElement, newRow);
    });
  
  // document.querySelector('button#delButton').addEventListener('click', 
    // function() {
      // delStockButtonHandler();
    // });
}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button#searchButton').addEventListener('click', search);
  stockTableElem = document.getElementById("stockTable");
});