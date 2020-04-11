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
   emptyBlocks: [],

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

   createEmptyBloks: function(id){
    var elCell = document.getElementsByTagName("td");
    for(var i = 0; i < (elCell.length)-1; i++){
      if (elCell[i].id !=="" && elCell[i].id !=="00" ){
        model.emptyBlocks.push(elCell[i].id);
         };
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
   deadClassBoks: function(){
    if(model.classN == "zero"){return "dead_zero"};
    if(model.classN == "cross"){return "dead_cross"};
   },

   YesOrNot: function(arr,el){
     var a = document.getElementById(el).className;
     if (a === controller.c ){return false}
     if (a === model.classN){return false };
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
  }
  

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
     
      for (var j = 0; j<3; j++){
        nRow = fRow - 1 + j;
         if(nRow<0 || nRow>5){continue}
        for (var i = 0; i<3; i++ ){
          nCall = fCall - 1 + i;
           if (nCall<0 || nCall>5){continue}
           if (document.getElementById(""+nRow + nCall).className === model.deadClassBoks() ){continue}
           if (document.getElementById(""+nRow + nCall).className === revers && c === (""+nRow + nCall)){continue}
           potentialBlocks.push(""+nRow + nCall);
        }
       }
      
       for (var i = 0; i < potentialBlocks.length; i++){
          if (model.YesOrNot(selected, potentialBlocks[i])){selected.push(potentialBlocks[i])};
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
           controller.turnC(c);
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

//анонимная функция

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
       model.createEmptyBloks("tbody");
     },

     event: function(){
        
        controller.hoverClick("tbody");
        
     }

  };

  war.init();

}());