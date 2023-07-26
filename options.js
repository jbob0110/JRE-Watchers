var team1 = [];
var team2 = [];
var team3 = [];

window.onload = () => {
  chrome.storage.sync.get(['T1array'], function (result) {
    if (result.T1array === undefined) {
      chrome.storage.sync.set({ T1array: team1 }, function () { console.log("Initial Team 1 array save!"); });
    }
  });

  chrome.storage.sync.get(['T2array'], function (result) {
    if (result.T2array === undefined) {
      chrome.storage.sync.set({ T2array: team2 }, function () { console.log("Initial Team 2 array save!"); });
    }
  });

  chrome.storage.sync.get(['T3array'], function (result) {
    if (result.T3array === undefined) {
      chrome.storage.sync.set({ T3array: team3 }, function () { console.log("Initial Team 3 array save!"); });
    }
  });

  addT1();
  document.getElementById('addT1').onclick = () => {
    var id = document.getElementById("T1id").value;
    chrome.storage.sync.get(['T1array'], function (result) {
      for (var i = 0; i < result.T1array.length; i++) {
        holder = result.T1array[i].split(", ");
        team1[holder[0]] = true;
      }
      if (team1[id] != undefined) {
        alert("ID is already on the list.");
        document.getElementById('T1id').value = '';
      } else {
        team1[id] = true;
        addNames('T1id', 'T1list', document.getElementById('T1id').value, team1, deleteT1);
      }
    });
  }

  addT2();
  document.getElementById('addT2').onclick = () => {
    var id = document.getElementById("T2id").value;
    chrome.storage.sync.get(['T2array'], function (result) {
      for (var i = 0; i < result.T2array.length; i++) {
        holder = result.T2array[i].split(", ");
        team2[holder[0]] = true;
      }
      if (team2[id] != undefined) {
        alert("ID is already on the list.");
        document.getElementById('T2id').value = '';
      } else {
        team2[id] = true;
        addNames('T2id', 'T2list', document.getElementById('T2id').value, team2, deleteT2);
      }
    });
  }

  addT3();
  document.getElementById('addT3').onclick = () => {
    var id = document.getElementById("T3id").value;
    chrome.storage.sync.get(['T3array'], function (result) {
      for (var i = 0; i < result.T3array.length; i++) {
        holder = result.T3array[i].split(", ");
        team3[holder[0]] = true;
      }
      if (team3[id] != undefined) {
        alert("ID is already on the list.");
        document.getElementById('T3id').value = '';
      } else {
        team3[id] = true;
        addNames('T3id', 'T3list', document.getElementById('T3id').value, team3, deleteT3);
      }
    });
  }
  
  document.getElementById('clearSyncStorage').onclick = () => {
    chrome.storage.sync.clear(function() {
      var error = chrome.runtime.lastError;
        if (error) {
          console.error(error);
        }
     });
     location.reload();
  }
}

function save_options() {
    chrome.storage.sync.set({
      T1array: team1,
      T2array: team2,
      T3array: team3,
    }, function () {
      console.log("Settings Saved");
    });
  }

function deleteT1(e) {
  var closebtns = document.getElementsByClassName("close");
  for (i = 0; i < team1.length; i++) {
      if (team1[i] === e.currentTarget.parentElement.innerHTML) {
        var holder = team1[i].split(", ");
        team1[holder[0]] = undefined;
        team1.splice(i, 1);
        e.currentTarget.parentElement.style.display = "none";
        break;
      }
  }
    save_options();
}

function deleteT2(e) {
  var closebtns = document.getElementsByClassName("close");
  for (i = 0; i < team2.length; i++) {
      if (team2[i] === e.currentTarget.parentElement.innerHTML) {
        var holder = team2[i].split(", ");
        team2[holder[0]] = undefined;
        team2.splice(i, 1);
        e.currentTarget.parentElement.style.display = "none";
        break;
      }
  }
    save_options();
}

function deleteT3(e) {
  var closebtns = document.getElementsByClassName("close");
  for (i = 0; i < team3.length; i++) {
      if (team3[i] === e.currentTarget.parentElement.innerHTML) {
        var holder = team3[i].split(", ");
        team3[holder[0]] = undefined;
        team3.splice(i, 1);
        e.currentTarget.parentElement.style.display = "none";
        break;
      }
  }
    save_options();
}

function addT1() {
  chrome.storage.sync.get(['T1array'], function (result) {
    for (var i = 0; i < result.T1array.length; i++) {
      result.T1array[i] = result.T1array[i].split("<sp")[0];
      addNames('T1id', 'T1list', result.T1array[i], team1, deleteT1);
    }
  });
}

function addT2() {
  chrome.storage.sync.get(['T2array'], function (result) {
    for (var i = 0; i < result.T2array.length; i++) {
      result.T2array[i] = result.T2array[i].split("<sp")[0];
      addNames('T2id', 'T2list', result.T2array[i], team2, deleteT2);
    }
  });
}

function addT3() {
  chrome.storage.sync.get(['T3array'], function (result) {
    for (var i = 0; i < result.T3array.length; i++) {
      result.T3array[i] = result.T3array[i].split("<sp")[0];
      addNames('T3id', 'T3list', result.T3array[i], team3, deleteT3);
    }
  });
}

function addNames(id, pointer, text, array, deleter) {
  var list = document.getElementById(pointer);
  var entry = document.createElement('li');
  entry.appendChild(document.createTextNode(text));
  var spanDelete = document.createElement("span");
  spanDelete.setAttribute("class", 'close');
  spanDelete.innerHTML = "&times;";
  list.appendChild(entry);
  entry.appendChild(spanDelete);
  array.push(entry.innerHTML);
  document.getElementById(id).value = '';
  spanDelete.addEventListener("click", deleter);
  save_options();
}

 function clearSyncStorage(){
  chrome.storage.sync.clear(function() {
    var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
   })
 }