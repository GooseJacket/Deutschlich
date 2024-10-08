//LOADING
function loadData(filePath) { //load the data (main function)
  var result = null;
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.open("GET", "cardSets/"+filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
  }

  result = result.split("\n");

  let ret = [];
  
  for(let i = 0; i < result.length; i++){
      if(result[i] != "" && result[i] != null && result[i] != undefined){
        if(result[i].split("UND").length > 1){
          ret.push(result[i].split("UND"));
        }
      }
  }

  return ret;
}
function populateDataVariable(){ //getCookie for the flashcard datas
  let u = getCookie("username");
  if(u == ""){warn();}
  let d = getCookie("dataSheet");
  //window.alert(d);
  if (d==""){
    window.alert("No data sheet selected!");
    window.location.replace("https://goosejacket.github.io/Deutschlich/chooseSet.html");
  }
  else
    return loadData(d);
  }  
function compare(a, b){ //allow multiple versions of the answers
  let equiv = ["ae", "ä","Ae", "Ä",  
               "oe", "ö", "Oe", "Ö",
               "ue", "ü", "Ue", "Ü",
               "ss", "ß", 
               "_", "-",
               "_", " ",
               "", "the_"];
  //window.alert(a + " " + b)
  if(a === b){return true;}
  for(let i = 0; i < equiv.length; i+=2){
      a = a.replaceAll(equiv[i+1], equiv[i]);
      b = b.replaceAll(equiv[i+1], equiv[i]);
  }
  if(a === b){return true;}
  while(a.includes("(") && a.includes(")") && a.indexOf("(") < a.indexOf(")")){
    a = a.replaceAll("_(", "(")
    a = a.replaceAll(")_", ")");
    let temp = a.split("(");
    temp[1] = temp[1].split(")")[1];
    a = temp.join("");
  }
  while(b.includes("(") && b.includes(")") && b.indexOf("(") < b.indexOf(")")){
    b = b.replaceAll("_(", "("); 
    b = b.replaceAll(")_", ")");
    let temp = b.split("(");
    temp[1] = temp[1].split(")")[1];
    b = temp.join("");
  }//window.alert(a + ":" + b)
  if(a === b){return true;}
  return false;
}

function getCookie(cname) { //general function that grabs cookie from server
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function storeScore(gameName, score){
//either A) this .txt does not exist, B) this .txt does exist but this game does not, or C) this .txt does exist and the game too
  let cname = getCookie("username");
  let cvalue = getCookie(cname).split("SET");
  let ds = getCookie("dataSheet");
  let print = gameName + "IST" + score;
  if(cvalue.includes(ds)){ //B OR C
    let dsGames = cvalue[cvalue.indexOf(ds) + 1].split("UND"); //FlashcardsIST0UNDDressIST100 //FlashcardsIST0, DressIST100
    let foundIt = false;
    for(let j = 0; j < dsGames.length; j++){
      let currentGameIter = dsGames[j].split("IST") //Flashcards, 0
      if(currentGameIter[0] === gameName){ //C
        foundIt = true;
        if(Number(currentGameIter[1]) < score){
          dsGames[j] = gameName + "IST" + score;
        }
      }
    }if(!foundIt){ //B
      dsGames.push(gameName + "IST" + score);
    }
    cvalue[cvalue.indexOf(ds) + 1] = dsGames.join("UND");
    cvalue = cvalue.join("SET")
  }else{ //A
    cvalue = getCookie(cname) + "SET" + ds + "SET" + print;
  }
  //set Cookie
  const d = new Date();
  d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
//MISC FUNCTIONS
function head() { //set up the header (so they're all the same)
  var result = "<div class='header'>";
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.open("GET", "header.txt", false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result += xmlhttp.responseText;
  }
  let greet = getCookie("username");
  if(greet != ""){result += "<div id='greeting'>Hallo, " + greet + "!</div>"; result.replace("Log In", "Change User")}
  document.body.innerHTML = result + "</div>" + document.body.innerHTML;
}
function gibtsNouns(){ //decide whether to show the nouns tile on index.html
  let data = populateDataVariable()
  let temp = []
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] != undefined) {
      if (["die", "der", "das"].includes(data[i][0].substring(0, 3))) {return true;}
    }
  }
  return false;
}

//LOGGING IN
function log(){ //open iframe to log in
  document.getElementById("LI").style.display = "";
}

function warn(){ //warn user that they are not logged in
  if(document.getElementById('log in babe') == null){
    let warning = "<div class='bigTile' id='log in babe'><h1>Warning: You are not logged in!</h1>Your name won't be on the results screens for homework checks.<br><button onclick=hide();>Dismiss</button></div>"
    document.body.innerHTML = warning + document.body.innerHTML;
  }
}
function hide(){ //hide warning
  if(document.getElementById('log in babe')){
    document.getElementById('log in babe').remove();
  }
}
