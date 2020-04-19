// Перечисление зависимостей:
const path = require('path');
const express = require('express');
const ch = require('./ch');
const app = express();

// Описание настроек:
var staticSiteOptions = {
    portnum: 3000, // слушать порт
};
//тест серверной обработки 
app.get('/subscribe', function(req, res){
    ch.subscribe(req, res);
})

app.use('/publish', function(req, res){
   var ebobo = '';
    req.on('readable', function(){
        ebobo = req.read();
        ebobo = JSON.parse(ebobo);
        ch.publish(''+ebobo);
    })
    .on('end', function(){
     res.end('ok');
   });
})
// Запуск сайта:
app.use(express.static(
    path.join(__dirname, 'static'),
    staticSiteOptions
)).listen(staticSiteOptions.portnum);

console.log('Server running on port: ' + staticSiteOptions.portnum);
console.log('To stop press CTRL+C');



