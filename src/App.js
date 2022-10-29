/*global chrome*/
import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

export const App = () => {
  const [average, setAverage] = useState(null);
  const makeQuery = (tabId) => {
    chrome.tabs.sendMessage(
      tabId,
      { type: "getAverage" },
      function (response) {
        if (response && response.average) {
          setAverage(response.average);
        }
      }
    );
  }
  useEffect(() => {
    // Since we want the popup to get the information from the content_script,
    // we send a request for this information from our content scripts
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let id = tabs[0].id
      makeQuery(id);
        if (!average) {
          // we wait for the page to load, to prevent the user from opening the popup when the page is still loading
          // causing the query to be done before products are on the page, leading to load (function(details)
          chrome.webNavigation.onCompleted.addListener(function ({ tabId }) {
            makeQuery(tabId);
          });
        }
    })
  }, [average])
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                {/* we show average price when it is available, else we show a simple message */}
                {average ? <><p>{"Average price: "}</p><p>{`US$${average}`}</p></> : <p>{"Search for Amazon products to get an average here"}</p> }
            </header>
        </div>
    );
};
export default App;
