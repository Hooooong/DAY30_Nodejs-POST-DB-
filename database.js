var http = require("http");
var u = require("url");
var qs = require("querystring");
var mongo = require("mongodb").MongoClient;

var server = http.createServer(function(req, res){

  var url = u.parse(req.url);
  var cmd = url.pathname.split("/");

  switch(cmd[1]){
    case 'signin':
      var postData = "";
      req.on('data', function(data){
          postData += data;
      });

      req.on('end',function(){
        console.log("postData : " + postData);
        // queryString 으로 보낼 경우
        // postData : id=root&pw=qwer1234
        // var query = qs.parse(postData);

        // json 데이터로 보낼 경우
        // postData : {"id":"root", "pw":"qwer1234"}
        var query = JSON.parse(postData);
        console.log("query : "+ query);
        // query = {
        //      id : 'root',
        //      pw : 'qwer1234'
        // }

        if(!query.id || !query.pw){
          res.end('ID or PW is wrong!');
        }else{
          // Mongo DB 주소 구조 = 프로토콜://주소:포트:데이터베이스명
          mongo.connect("mongodb://localhost:27017/testdb", function(error, db){
            if(error){
              res.write("error : " + error);
              res.end("");
            }else{
              // DB 검색
              // 검색의 쿼리 구조는 json 구조로 날려줘야 한다.
              // json object = javascript object 와 1:1 매칭이 된다
              // 그러므로 query 만 넣어주면 된다.
              var cursor = db.collection('user').find(query);
              console.log("cursor : " + cursor);
              // 데이터 셋 처리 방법
              // 1. forEach() : 비동기 방식
              // 2. each() : 동기 방식
              // 데이터를 모두 처리해야 하기 때문에 forEach() 방식으로 처리해야 한다.

              var obj = {
                code : "",
                msg :""
              }

              // var write = 'FAIL';
              obj.code = '300';
              obj.msg = 'FAIL';

              cursor.toArray(function(error, dataSet){
                if(dataSet.length > 0){
                  // var write = 'OK';
                  obj.code = '200';
                  obj.msg = 'OK';
                }

                console.log(obj);
                // 일반적으로 데이터를 보낼 경우
                // result : OK or FAIL
                // res.write(result);

                // JSON 으로 데이터를 보낼 경우
                // JSON.stringify(obj) 실패 : {"code":"300", "msg":"FAIL"}
                // JSON.stringify(obj) 성공 : {"code":"200", "msg":"OK"}
                res.write(JSON.stringify(obj));
                res.end("");
              });
            }
          });
        }
      });
      break;
    default :
      res.end('page not found');
      break;
  }
});

server.listen(8090, function(){
  console.log("Server is Running.....");
});
