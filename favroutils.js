/* 
  Favro doesn't handle card parameter in short urls (domain.favro.com)
  This forces it...
*/
var card = null;

function loginControllerHijack(tabId, changeInfo, tabInfo) {
  if (card == null) {
    if (changeInfo.status == "complete" && changeInfo.url && changeInfo.url.startsWith("https://favro.com/login?")) {
      const parsedUrl = new URL(changeInfo.url);
      var domain = parsedUrl.searchParams.get("domain");
      if (domain && !card) {
        card = parsedUrl.searchParams.get("card");
        console.log("Found Card param during domain redirect:" + card);
      }
    }
  } else {
    if (changeInfo.status == "complete" && changeInfo.url && changeInfo.url.startsWith("https://favro.com/organization/")) {
      const parsedUrl = new URL(changeInfo.url);
      var cardArg = parsedUrl.searchParams.get("card");
      if (cardArg == null) {
      	parsedUrl.searchParams.set("card", card);
      	var newUrl = parsedUrl.href;
      	card = null;
      	// hijack the redirect
        console.log("new organization URL with injected card " + newUrl);
        browser.tabs.update(tabId, {url: newUrl});
      }
    }
  }
}

browser.tabs.onUpdated.addListener(loginControllerHijack); 
