var jiraKey;
var project;
var jiraInstance;
var url;
var gJiraKey;
var gAsset;
var gAlignTeam;
var gComp;
// asyncRequestCount keeps track of when the sub-tasks are being sent.
var asyncRequestCount = 0;

/**This if checks the users browser and grabs their browser information based on this.*/
chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
  url = tabs[0].url;
  tabId = tabs[0].id;
  values = getURLs(url);
  jiraKey = values['jiraKey'];
  project = values['project'];
  jiraInstance = values['jiraInstance'];
  console.log(tabId);
  console.log("jira key: " + jiraKey);
  console.log("jira project: " + project);
  console.log("jira instance: " + jiraInstance);
  if (jiraInstance.includes("jira")) {
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      func: getJiraValues
    })
    .then(injectionResults => {
      for (const {result} of injectionResults) {
        gIssueType = result['issueType'];
        gSolution = result['solution'];
        gSolutionDetail = result['solutionDetail'];
        gJiraGroup = result['jiraGroup'];
      };
      console.log("issue type: " + gIssueType);
      console.log("solution: " + gSolution);
      console.log("solution detail: " + gSolutionDetail);
      console.log("jira group: " + gJiraGroup);
    });
  };
});

var T1array = [];
chrome.storage.sync.get(['T1array'], function (result) {
  if(result.T1array){
    for (var i = 0; i< result.T1array.length; i++){
      // Entries in the array are formatted as `"\"JB044663\"<span class=\"close\">×</span>"` this split strips out `"\"JB044663\"`
      var split1 = result.T1array[i].split("<span");
      T1array.push(split1[0]);
      console.log(split1[0]);
    } 
  }
}
);

var T2array = [];
chrome.storage.sync.get(['T2array'], function (result) {
  if(result.T2array){
    for (var i = 0; i< result.T2array.length; i++){
      // Entries in the array are formatted as `"\"JB044663\"<span class=\"close\">×</span>"` this split strips out `"\"JB044663\"`
      var split2 = result.T2array[i].split("<span");
      T2array.push(split2[0]);
      console.log(split2[0]);
    } 
  }
}
);

var T3array = [];
chrome.storage.sync.get(['T3array'], function (result) {
  if(result.T3array){
    for (var i = 0; i< result.T3array.length; i++){
      // Entries in the array are formatted as `"\"JB044663\"<span class=\"close\">×</span>"` this split strips out `"\"JB044663\"`
      var split3 = result.T3array[i].split("<span");
      T3array.push(split3[0]);
      console.log(split3[0]);
    } 
  }
}
);

window.onload = () => {
  document.getElementById('BTNaddWatchers').onclick = () => {
  document.getElementById('loader').style.display = "block";
    if (gJiraGroup === 'DW: Andromeda') {
      for (var i = 0; i< T1array.length; i++){
        addWatchers(T1array[i].replaceAll("\"", "")) // strips extra characters `"\"JB044663\"` to `JB051074`
      };
      console.log("Watcher Request Sent");

    } else if (gJiraGroup === 'DW: DISTopia') {
      for (var i = 0; i< T2array.length; i++){
        addWatchers(T2array[i].replaceAll("\"", "")) // strips extra characters `"\"JB044663\"` to `JB051074'
      };
      console.log("Watcher Request Sent");
    
    } else if (gJiraGroup === 'DW: Regulators') {
      for (var i = 0; i< T3array.length; i++){
        addWatchers(T3array[i].replaceAll("\"", "")) // strips extra characters `"\"JB044663\"` to `JB051074`
      };
    console.log("Watcher Request Sent");
    };
  };
  document.getElementById('options').onclick = () =>{
    window.open(chrome.runtime.getURL('options.html'));
  };
};

function getURLs(url){
  var re = /https\:\/\/(.+?)\..+\/((.+?)\-[^\?]+)/;
  var regexGroups = { jIns: 1, jKey: 2, pKey: 3 };
  var m = re.exec(url);
  return {
    jiraKey: m[regexGroups.jKey],
    project: m[regexGroups.pKey],
    jiraInstance: m[regexGroups.jIns],
  }
};

function getJiraValues(){
  return {
    issueType: document.getElementById('type-val').innerText,
    solution: document.getElementById('customfield_14800-val').innerText,
    solutionDetail: document.getElementById('customfield_14801-val').innerText,
    jiraGroup: document.getElementById('customfield_14802-val').innerText,
  }
};

/** This function checks if the asyncRequestCount is 0 then will reload the page, and hide the loading spinner*/
function checkAsynRequestCount(){
  if(asyncRequestCount === 0){
    chrome.tabs.reload();
    document.getElementById('loader').style.display = "none";
  }
};

function addWatchers(watchers){
  var xhr = new XMLHttpRequest;
  xhr.open("POST", "https://"+jiraInstance+".cerner.com/rest/api/2/issue/"+jiraKey+"/watchers"); 
  xhr.setRequestHeader("Content-Type","application/json","Access-Control-Allow-Origin");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      console.log(xhr.responseText);
      asyncRequestCount--;
      checkAsynRequestCount();
    }
  };
  asyncRequestCount++;
  xhr.send(JSON.stringify(watchers));
};
