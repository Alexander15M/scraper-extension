/*global chrome*/
// wait for the popup 
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        switch(message.type) {
            case "getAverage":
                const prices_nodes = [...document.querySelectorAll("span.a-price-whole")];
                // we want to avoid running the queries if no price is found (we could be in Amazon's landing page)
                if (prices_nodes && prices_nodes.length > 0) {

                    /// compute the average
                    const prices_sum = prices_nodes.reduce((sum, pnode) => {
                        const price_txt = pnode?.parentElement?.textContent?.replace(/[^\d,.]/g, "");
                        const price = parseFloat(price_txt);
                        return sum + price;
                    }, 0);
                
                    let prices_average = prices_sum / prices_nodes.length;
                    prices_average = Math.round(prices_average * 100) / 100

                    // send it back to the popup
                    sendResponse({average: prices_average});
                }
                break;
            default:
                console.error("Unrecognised message: ", message);
        }
    }
);