'use strict';

var host = '127.0.0.1';
var port = '4000';

var express = require('express');
var app = express();

//设置静态文件夹
app.use(express.static(__dirname)); //目录为 node_js
console.log('__dirname: ' + __dirname);


app.listen(port, host);