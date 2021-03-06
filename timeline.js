
var n = 7;
var a = 0;
var e;
var m;
var mousePos;
var mousePosDiv;
var originalYPos = [];
var yPos = [];
var fields = [];
var divTops = [];
var origDivTops = [];

var fieldsLength;
var fieldLog =[];

var counter;
var initialNumber = true;
var initialState = true;
var projects = document.getElementsByClassName("project");
var canvasPos;
var descriptions;
var first = true;


function zoom(){
  //colors
  newYPos = [];
  newYTextPos = [];
  for (var i = 0; i < mousePos; i++){
    var y = 0;
    y = pow(gHeight/yPos[i],-m*(yPos[i]/gHeight)) * (yPos[i] + gHeight) - gHeight;
    newYPos[i] = y;
  } 
  for (var i = mousePos; i < fieldsLength+1; i++){
    var y = 0;
    y = pow(gHeight/yPos[i],m*(yPos[i]/gHeight)) * (yPos[i] + gHeight) - gHeight;
    newYPos[i] = y;
  }
  //text
  for (var i = 0; i < mousePosDiv; i++){
    var yText = 0;
    yText =  pow(gHeight/divTops[i],-m*(divTops[i]/gHeight)) * (divTops[i] + gHeight) - gHeight;
    newYTextPos[i] = yText;
  }
  for (var i = mousePosDiv; i < projects.length; i++){
    var yText = 0;
    yText = pow(gHeight/divTops[i],m*(divTops[i]/gHeight)) * (divTops[i] + gHeight) - gHeight;
    newYTextPos[i] = yText;
  }

  console.log("m = " + m);
  if(m >= 0 && newYTextPos[0] > 0.5 && newYTextPos[fields.length-2] < gHeight - 0.5 || m < 0){
  	console.log("BLOCKED");
    yPos = newYPos;
    divTops = newYTextPos;
  }

  for (var i = 0; i < fieldsLength; i++){
    fields[i].y1 = yPos[i];
    fields[i].y2 = yPos[i+1];
    fields[i].fieldHeight = yPos[i+1] - yPos[i];
  }

  initialState = false;
  //Check for deepen
  if (mousePos === 0 && fields[0].fieldHeight/(n-1) > fields[1].fieldHeight){
    deepen(0);
  } 
  for (var i = 1; i < fieldsLength - 1; i++){
    if(fields[i].fieldHeight/(n-1) > fields[i-1].fieldHeight && 
       fields[i].fieldHeight/(n-1) > fields[i+1].fieldHeight &&
       i === mousePos - 1){
       deepen(i);
    }
  }
  if (mousePos == n-1 && fields[fieldsLength-1].fieldHeight/(n-1) > fields[fieldsLength-2].fieldHeight) deepen(fieldsLength-1);
  
  //Check for flatten 
  if (mousePos == 1 && fields[0].fieldHeight < fields[1].fieldHeight - 5){
    if (!initialNumber) flatten();
    else snap();
  } else if (mousePos == fieldsLength && fields[fieldsLength-1].fieldHeight < fields[fieldsLength-2].fieldHeight - 5){
    if (!initialNumber) flatten();
    else snap();
  } else {
    for (var i = 1; i < fieldsLength - 1; i++){
      if(fields[i].fieldHeight < fields[i-1].fieldHeight - 5 && 
         fields[i].fieldHeight < fields[i+1].fieldHeight - 5 &&
         i == mousePos - 1){
         if (!initialNumber) flatten();
         else snap();
      }
    }
  }

  for (var i = 0; i < projects.length; ++i){
    let top = canvasPos + Math.round(divTops[i])
    projects.item(i).style.top = top.toString();
  }


  let h1 = projects.item(mousePosDiv - 1).getElementsByTagName("h1")[0];
  let h2 = projects.item(mousePosDiv - 1).getElementsByTagName("h2")[0];
  let h3 = projects.item(mousePosDiv - 1).getElementsByTagName("h3")[0];
  
  let mediaContainer = projects.item(mousePosDiv - 1).getElementsByClassName("media-container")[0];


  var dist;
  if (mousePosDiv === divTops.length){
    dist = gHeight - divTops[mousePosDiv - 1];
  } else {
    dist = divTops[mousePosDiv] - divTops[mousePosDiv - 1];
    console.log("mousePosDiv = " + mousePosDiv);
    console.log("divTops = " + divTops[mousePosDiv - 1]);
    console.log("dist  =" + dist);
  }

  //title size increase/decrease
    if (dist > (300/defaultHeight)*gHeight){
        h1.style.fontSize = getComputedStyle(h1).getPropertyValue("--h1-font-large");
        h1.style.fontWeight = "bold";
    } else {
        h1.style.fontSize = getComputedStyle(h1).getPropertyValue("--h1-font-small");
        h1.style.fontWeight = "lighter";
    }


   
  //description text on/off
  if (dist > (350/defaultHeight)*gHeight){
      h3.style.display = "block";
  } else {
      h3.style.display = "none";
  }


  //images on/off
  if (dist > (600/defaultHeight)*gHeight){
      let height = divTops[mousePosDiv] - divTops[mousePosDiv - 1];
      setActiveMediaContainer(mousePosDiv);
      mediaContainer.style.opacity = "1.0";
      imgs = mediaContainer.getElementsByClassName("display-img");
      for (var i = 0; i < imgs.length; ++i){
        imgs[i].style.cursor = "pointer";
      }
  } else {
      console.log("hello");
      setActiveMediaContainer(0);
      mediaContainer.style.opacity = "0.0";
      imgs = mediaContainer.getElementsByClassName("display-img");
      for (var i = 0; i < imgs.length; ++i){
        imgs[i].style.cursor = "default";
      }
  }

  //title display on/off when smoll
  if (dist > (50/defaultHeight)*gHeight){
      h1.style.display = "block";
  } else {
      h1.style.display = "none";
  }


  //date display on/off wgeb smoll
  if (dist > (20/defaultHeight)*gHeight){
      h2.style.display = "block";
  } else {
  		console.log("disappear");
      h2.style.display = "none";
  }
}

function snap(){
  for (var i = 0; i < n; i++){
    var y = i* (gHeight/(n-1));
    originalYPos[i] = y;
    yPos[i] = y;
  }
  
  for (var i = 0; i < n-1; i++){
    fields[i].y1 = yPos[i];
    fields[i].y2 = yPos[i+1];
  }

  divTops = origDivTops;

  initialState = true;
}

function deepen(index){
  fieldLog.push(index);
  var fieldHeight = fields[index].fieldHeight/(n-1);
  var startY = fields[index].y1;
  var originalHeightIncrement = (originalYPos[index+1] - originalYPos[index])/(n-1);
  var originalStartY = originalYPos[index];
  
  colorMode(HSB);
  var c1;
  var c2;
  
  if (index == 0){
    c1 = fields[index].hue;
    c2 = fields[index+1].hue;
  } else if (index == fieldsLength - 1){
    c1 = fields[index-1].hue;
    c2 = fields[index].hue;
  } else {
    c1 = fields[index-1].hue;
    c2 = fields[index+1].hue;
  }
  
  var cInterval = (c2-c1)/(n);
  
  
  for (var i = 0; i < n-1; i++){
    newField = new Field(startY + i * fieldHeight, startY + (i+1)*fieldHeight, c1 + (i+1)*cInterval,index+i+1);
    originalYPos.splice(index + i+1, 0, originalStartY + i * originalHeightIncrement);
    yPos.splice(index + i+1, 0, newField.y1);
  }

  fields.splice(index,1);
  yPos.splice(index,1);
  originalYPos.splice(index,1);
  fieldsLength = fields.length;
  currentMousePos();
  initialNumber = false;
}

function flatten(){
  var index = fieldLog[fieldLog.length-1];
  
  for (var i = n-1; i > 0; i--){
    fields.splice(i + index - 1,1);
    yPos.splice(i + index - 1,1);
    originalYPos.splice(i + index - 1,1);
  }

  fieldsLength = fields.length;
  var c = 0;
  var y1;
  var y2;

  if (index == 0){
    c = 0;
    y1 = 0;
    y2 = fields[index].y1;
  } else if (index == fieldsLength){
    c = 255 - (255/(n-1));
    y1 = fields[index-1].y2;
    y2 = gHeight;
  } else {
    c = (fields[index-1].hue + fields[index].hue)/2;
    y1 = fields[index-1].y2;
    y2 = fields[index].y1;
  }

  yPos.splice(fields.length-1, yPos.length - fields.length - 1);
  
  newField = new Field(y1, y2, c, index);
  fieldsLength = fields.length;
  yPos.splice(index, 0, newField.y1);
  originalYPos.splice(index, 0, newField.y1);
  fieldLog.splice(fieldLog.length-1,1);
  currentMousePos();
  if (fieldsLength == n-1) initialNumber = true;
  yPos[yPos.length-1] = gHeight;
}

function create(){
  for (var i = 0; i < n; i++){
    var y = i* (gHeight/(n-1));
    originalYPos.push(y);
    yPos.push(y);
  }
  for (var i = 0; i < n-1; i++){
    newField = new Field(yPos[i], yPos[i+1], (i)*(255/(n-1)),i);
  }
  fieldsLength = n-1;
}
    
function setup() {
  var sketchHolder = document.getElementById('sketch-holder');
  p5Canvas = createCanvas(20,3000);
  p5Canvas.parent(sketchHolder);
  document.getElementById("pre-sketch").style.display = "none";
  background(255);
  // canvasPosCalibrate();
  // divTopsCalibrate();
  resizeTimeline(window.innerHeight);
  create();
  display();
  // for (var i = 0; i < projects.length; ++i){
  //   origDivTops[i] = projects.item(i).getBoundingClientRect().top;
  // }
}


function mouseWheel(event){
  counter++;
  e = event.delta;
  m = e/1000;
  if(a === 0) currentMousePos();
  a += e/5000;
  if (a < 0) a = 0;  if (!initialState || e > 0) zoom();
  display();
}

function currentMousePos(){
  console.log("currentMousePos");
  for (var i = 0; i < fieldsLength; i++){
    if (mouseY >= yPos[i] && mouseY < yPos[i+1]){
      mousePos = i+1;
    }
  }
  for (var i = 0; i < projects.length; i++){
      if (mouseY >= divTops[i] && mouseY < divTops[i+1] || mouseY < divTops[i] && i === 0 || mouseY > divTops[i] && i === divTops.length-1){
      mousePosDiv = i+1;
    }
  }
}

function display(){
  background(255);
  for (var i = 0; i < fieldsLength; i++){
    colorMode(HSB,255);
    fill(fields[i].hue, 255, 255);
    noStroke();
    rect(0, fields[i].y1, gWidth, fields[i].y2 - fields[i].y1);
  }
}

class Field{
  constructor(y1, y2, hue, index){
    this.y1;
    this.y2; 
    this.hue;
    this.y1 = y1;
    this.y2 = y2;
    this.hue = hue;
    
    this.fieldColor = color(hue, 255, 255);
    this.fieldHeight = y2 - y1;
    fields.splice(index, 0, this);
  }
  
  update(){
    this.fieldHeight = this.y2 - this.y1;
  }
}


function resizeTimeline(nHeight){
	console.log("hello");
  // resizeCanvas(gWidth, window.innerHeight);

  for (let i = 0; i < yPos.length; ++i){
    yPos[i] = Math.round((yPos[i]/gHeight) * nHeight);
    originalYPos[i] = Math.round((originalYPos[i]/gHeight) * nHeight);
  }

  for (var i = 0; i < fieldsLength; i++){
    fields[i].y1 = yPos[i];
    fields[i].y2 = yPos[i+1];
    fields[i].fieldHeight = yPos[i+1] - yPos[i];
  }
  display();
}
