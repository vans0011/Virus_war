// Перечисление зависимостей:
const path = require('path');
const express = require('express');
const app = express();

// Описание настроек:
var staticSiteOptions = {
    portnum: 3000, // слушать порт
};

// Запуск сайта:
express().use(express.static(
    path.join(__dirname, 'static'),
    staticSiteOptions
)).listen(staticSiteOptions.portnum);

console.log('Server running on port: ' + staticSiteOptions.portnum);
console.log('To stop press CTRL+C');



