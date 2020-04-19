

//а вот тут функция запроса на сервак
var request = {

publish: function(c){
var xhr = new XMLHttpRequest();
xhr.open('POST','publish', true);
var s = JSON.stringify(c);

xhr.send(s);

return false;
},

subscribe: function() {
 
  var xhr = new XMLHttpRequest();

  xhr.open("GET", "/subscribe", true);

  xhr.onload = function () {
     
      var li = "";
      li = this.responseText;
      controller.turnC(li);
      request.subscribe();
  };

  xhr.openerror = xhr.onabort = function () {
      setTimeout(subscribe, 500)
  };

  xhr.send('');
}

};


//Предствалние 
var view = {
  showCross : function(id){
    var cr = document.getElementById(id);
     if( cr.className == "zero"){
      cr.setAttribute("class", "dead_zero");
     }
    else{
      cr.setAttribute("class", "cross");
    } 
  },
  
  showZero : function(id){

    var zer = document.getElementById(id);
    if( zer.className == "cross"){
      zer.setAttribute("class", "dead_cross");
     }
    else{
     zer.setAttribute("class", "zero"); }
  },
  
  showClass: function(id, classN){
    var er = classN;
       if (er === "zero"){
        view.showZero(id);
       }
       if (er === "cross"){
        view.showCross(id);
      } 
   },

  msg: function(msg){
    var ms = document.getElementById("msg");
    ms.innerHTML = msg;
  }
};
  
//Сдесь сама модель

var model = {
   numTurns: 0,
   classN: "cross",

   openCross: ["00"],
   openZero: ["55"],  
   

   turn: function(id){
     
     view.showClass(id, model.classN);

     var cn = model.classN;
     this.numTurns++;
      if (this.numTurns == 3){
       if(model.classN === "cross"){
        this.numTurns = 0;
        model.classN = "zero";
        view.msg("Ходят нолики");
        return true;
      }
      if(model.classN === "zero"){
        this.numTurns = 0;
        model.classN = "cross";
        view.msg("Ходят Крестики");
      }
    }
   },

   selectClassBoks: function(){
     if(model.classN == "zero"){return model.openZero};
     if(model.classN == "cross"){return model.openCross};
   },

   reversClassBoks: function(){
    if(model.classN == "zero"){return "cross"};
    if(model.classN == "cross"){return "zero"};
   },
   deadClassBoks: function(el){
    if(el == "zero"){return "dead_zero"};
    if(el == "cross"){return "dead_cross"};
   },

   YesOrNot: function(arr,el){
     var a = document.getElementById(el).className;
     if (a === controller.c ){return false};
     if (a === model.classN){return false };
     if (a === model.deadClassBoks(model.reversClassBoks())){return false};
    for (var i=0; i< arr.length; i++){
      if (el == arr[i]){return false};
    }
       return true;
   },

   clear: function(c, el){
    var arrBuff = [];
    for(var i = 0; i < el.length;i++){
     if (el[i] == 'empty' || el[i]===c){continue};
     arrBuff.push(el[i]);
    };
    if(model.classN === "zero"){model.openZero = arrBuff};
    if(model.classN === "cross"){model.openCross = arrBuff};
    delete arrBuff;
  },

};
//тут контролер будет
var controller = {
  
  
  turnC: function(c){
    var selected = model.selectClassBoks();
    var revers = model.reversClassBoks();
   for(var i = 0; i < selected.length;i++){
    if(c == selected[i]){
      break;
    }
   };
    if(c == selected[i]){
     var id = c;
     var fRow = c.charAt(0);
     var fCall = c.charAt(1);
     var nCall;
     var nRow;
     var potentialBlocks=[];
     
     
      for (var j = 0; j<3; j++){ //выбор строки
        nRow = fRow - 1 + j;
         if(nRow<0 || nRow>5){continue} // проверка на выход за граниицы 
        for (var i = 0; i<3; i++ ){ // проверка по столбцам
          nCall = fCall - 1 + i;
           if (nCall<0 || nCall>5){continue}//выход за границы
           if (document.getElementById(""+nRow + nCall).className === model.deadClassBoks(model.classN) ){continue} // так это работает
           if (document.getElementById(""+nRow + nCall).className === revers && c == (""+nRow + nCall)){continue}
           if (document.getElementById(c).className == revers && document.getElementById(""+nRow + nCall).className == revers){ 
            continue;
           }
           potentialBlocks.push(""+nRow + nCall);
       }
      
       for (var i = 0; i < potentialBlocks.length; i++){
          if (model.YesOrNot(selected, potentialBlocks[i])){selected.push(potentialBlocks[i])};
          
        }
       }
       delete potentialBlocks;
         
       model.clear(c, selected); 
     model.turn(c);    
    }
     else {
       var mss = "Не туда, читай правила";
      view.msg(mss);
     }

  },

  hoverClick: function(id){
    var el = document.getElementById(id);
    el.onmouseover = function (e){
        e = e || window.event;
         
        if(e.target.id != "" && e.target.className !=="zero" && e.target.className !=="cross"  ){
          e.target.style.transiton = "0.9";
          e.target.style.backgroundColor = "rgb(0, 0, 0, 0.6)";
         
          e.target.onclick = function(){
           var c = this.getAttribute("id");
           request.publish(c);
           //controller.turnC(c);
           this.setAttribute("data-title","");
          };
        } 
    } ;

    el.onmouseout = function(e){
      e = e|| window.event;

      if(e.target.id != "" ){
       e.target.style = "td";
      }
    };
  },
  
  createDataTitle: function(){
     
    var elCell = document.getElementsByTagName("td");
     for(var i = 0; i < elCell.length; i++){
           if (elCell[i].id !==""){
             var value = elCell[i].getAttribute("id")
             var element = elCell[i];
             var letter = element.parentNode.firstElementChild.firstElementChild.innerHTML;

             elCell[i].setAttribute("data-title", letter + value.charAt(1));
           }
     };
  },

};

(function(){
  var war = {
     init: function(){
       this.main();
       this.control();
       this.event();
     },

     main: function(){ 
       
     },

     control: function(){
       controller.createDataTitle(); 
       request.subscribe();
     },

     event: function(){
        controller.hoverClick("tbody");
     }
  };

  war.init();

}());