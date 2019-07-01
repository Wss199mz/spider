var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var t = new Date().getTime();
var newsList = fs.readdirSync('./newsTitle/') // 读取目录下存储文件

var url = "http://news.baidu.com/widget?id=PicWall&" + t;

http.get(url, function (res) {
  var html = '';        //用来存储请求网页的整个html内容
  res.setEncoding('utf-8'); //防止中文乱码
  //监听data事件，每次取一块数据
  res.on('data', function (chunk) {
    html += chunk;
  });
  //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
  res.on('end', function () {
    var $ = cheerio.load(html); //采用cheerio模块解析html
    var chapters = $('.image-list-item');
    chapters.each(function (item) {
      var title = $(this).text().trim()
      if (title && newsList.indexOf(title+'.txt') < 0) {
        var content = title + '=> (' + $(this).find('a').attr('href') + ')'
        fs.appendFile('./newsTitle/' + title + '.txt', content, 'utf-8', function (err) {
          if (err) {
            console.log(err);
          }
        });
        request($(this).find('img').attr('src')).pipe(fs.createWriteStream('./image/'+title + '.jpg'));
      }
    })
  });

}).on('error', function (err) {
  console.log(err);
});
