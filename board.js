var flag=1;

var div00=document.getElementById("00");
div00.addEventListener("click",function(){
  var p1=document.createElement("p");
  if(flag){
    var text=document.createTextNode("0")
  }else{
    var text=document.createTextNode("1")
  }
  p1.appendChild(text);
  div00.appendChild(p1);
  flag=!flag;
  check();
})
var div01=document.getElementById("01");
div01.addEventListener("click",function(){
  var p1=document.createElement("p");
  if(flag){
    var text=document.createTextNode("0")
  }else{
    var text=document.createTextNode("1")
  }
  p1.appendChild(text);
  div01.appendChild(p1);
  flag=!flag;
  check();
})
var div02=document.getElementById("02");
div02.addEventListener("click",function(){
  var p1=document.createElement("p");
  if(flag){
    var text=document.createTextNode("0")
  }else{
    var text=document.createTextNode("1")
  }
  p1.appendChild(text);
  div02.appendChild(p1);
  flag=!flag;
  check();
})
var div10=document.getElementById("10");
div10.addEventListener("click",function(){
  var p1=document.createElement("p");
  if(flag){
    var text=document.createTextNode("0")
  }else{
    var text=document.createTextNode("1")
  }
  p1.appendChild(text);
  div10.appendChild(p1);
  flag=!flag;
  check();
})
var div11=document.getElementById("11");
div11.addEventListener("click",function(){
  var p1=document.createElement("p");
  if(flag){
    var text=document.createTextNode("0")
  }else{
    var text=document.createTextNode("1")
  }
  p1.appendChild(text);
  div11.appendChild(p1);
  flag=!flag;
  check();
})
var div12=document.getElementById("12");
div12.addEventListener("click",function(){
  var p1=document.createElement("p");
  if(flag){
    var text=document.createTextNode("0")
  }else{
    var text=document.createTextNode("1")
  }
  p1.appendChild(text);
  div12.appendChild(p1);
  flag=!flag;
  check();
})
var div20=document.getElementById("20");
div20.addEventListener("click",function(){
  var p1=document.createElement("p");
  if(flag){
    var text=document.createTextNode("0")
  }else{
    var text=document.createTextNode("1")
  }
  p1.appendChild(text);
  div20.appendChild(p1);
  flag=!flag;
  check();
})
var div21=document.getElementById("21");
div21.addEventListener("click",function(){
  var p1=document.createElement("p");
  if(flag){
    var text=document.createTextNode("0")
  }else{
    var text=document.createTextNode("1")
  }
  p1.appendChild(text);
  div21.appendChild(p1);
  flag=!flag;
  check();
})
var div22=document.getElementById("22");
div22.addEventListener("click",function(){
  var p1=document.createElement("p");
  if(flag){
    var text=document.createTextNode("0")
  }else{
    var text=document.createTextNode("1")
  }
  p1.appendChild(text);
  div22.appendChild(p1);
  flag=!flag;
  check();
})

function check(){
  var numlist=[]
  var list=document.getElementsByClassName("size");
  // var content=list[0].firstChild.firstChild;
  for(i=0;i<list.length;i++){
    if(list[i].firstChild!=null){
      var content=list[i].firstChild.firstChild;
      // console.log(content)
      // console.log(typeof(content))
      numlist.push(content.data);
    }else{
      numlist.push(" ");
    }
    
  }
  console.log(numlist)
  if(numlist[0]==numlist[1]&& numlist[1]==numlist[2]){
    if(numlist[2]=="0"){
      console.log("0 wins")
      window.alert("0 wins");
    }else if(numlist[2]=="1"){
      console.log("1 wins")
      window.alert("1 wins");
    }
  }else if(numlist[3]==numlist[4]&& numlist[4]==numlist[5]){
    if(numlist[5]=="0"){
      console.log("0 wins")
      window.alert("0 wins");
    }else if(numlist[5]=="1"){
      console.log("1 wins")
      window.alert("1 wins");
    }
  }else if(numlist[6]==numlist[7]&& numlist[7]==numlist[8]){
    if(numlist[8]=="0"){
      console.log("0 wins")
      window.alert("0 wins");
    }else if(numlist[8]=="1"){
      console.log("1 wins")
      window.alert("1 wins");
    }
  }else if(numlist[0]==numlist[4]&& numlist[4]==numlist[8]){
    if(numlist[8]=="0"){
      console.log("0 wins")
      window.alert("0 wins");
    }else if(numlist[8]=="1"){
      console.log("1 wins")
      window.alert("1 wins");
    }
  }else if(numlist[2]==numlist[4]&& numlist[4]==numlist[6]){
    if(numlist[6]=="0"){
      console.log("0 wins")
      window.alert("0 wins");
    }else if(numlist[6]=="1"){
      console.log("1 wins")
      window.alert("1 wins");
    }
  }else if(numlist[0]==numlist[3]&& numlist[3]==numlist[6]){
    if(numlist[6]=="0"){
      console.log("0 wins")
      window.alert("0 wins");
    }else if(numlist[6]=="1"){
      console.log("1 wins")
      window.alert("1 wins");
    }
  }else if(numlist[1]==numlist[4]&& numlist[4]==numlist[7]){
    if(numlist[7]=="0"){
      console.log("0 wins")
      window.alert("0 wins");
    }else if(numlist[7]=="1"){
      console.log("1 wins")
      window.alert("1 wins");
    }
  }else if(numlist[2]==numlist[5]&& numlist[5]==numlist[8]){
    if(numlist[5]=="0"){
      console.log("0 wins")
      window.alert("0 wins");
    }else if(numlist[5]=="1"){
      console.log("1 wins")
      window.alert("1 wins");
    }
  }else{
    var check=0
    for (i=0;i<numlist.length;i++){
      if(numlist[i]==" "){
        check=1
        break;
      }
    }
    if(check==0){
      console.log("tie");
      window.alert("tie");
    }

  }
}