var http = require("http");
var url = require("url");
var queryString = require("querystring");
// 파일을 읽을 수 있는 Api
var fs = require("fs");

// 주소(Rest Api) 요청의 형태
// http://localhost:8090/post?filePaht=/dir1/xxx.png
var server = http.createServer(function(req, res){

  var sampleUrl = url.parse(req.url);
  // 1. 주소에서 명령어 = 서버 자원의 이름 또는 ID(URI) 를 꺼낸다
  var path = sampleUrl.pathname;
  var cmds = path.split('/');
  // 2. Method 를 꺼낸다.
  if(cmds[1] == 'html'){
    var filePath = path.substring(1);
    fs.readFile(filePath, function(error, data){
      if(error){
        res.writeHead(500, {'Content-type': 'text/html'});
        res.end("error : " + error);
      }else{
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(data);
      }
    });
  }else if(cmds[1] == 'signin'){
      var id = "root";
      var pw = "qwer1234";

      // var query = sampleUrl.query;
      var sign;
      var post_data ="";
      req.on('data', function(data){
        // 입력받은 data가 매개변수로 들어온다.
        post_data += data;
      });

      req.on('end', function(){
        // post_data = "id=root&&pw=qwer1234";
        //console.log("post_data :" + post_data);
        sign = queryString.parse(post_data);
        console.log("sign.id : " + sign.id );
        console.log("sign.pw : " + sign.pw);
        if(sign.id == id && sign.pw == pw){
          res.writeHead(200,{'Content-type':'text/html'});
          res.end("OK");
        }else{
          res.writeHead(200,{'Content-type':'text/html'});
          res.end("FAIL");
        }
      });
  }else{
    res.writeHead(404,{'Content-type':'text/html'});
    res.end("404 Page Not Found!")
  }
});

server.listen(8090,function(){
  console.log("Server is Running......................");
});
