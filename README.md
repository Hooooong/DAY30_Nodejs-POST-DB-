Android Programing
----------------------------------------------------
### 2017.10.26 26일차

#### 예제
____________________________________________________

- [Android 와 Node.js 통신으로 간단한 Login 처리](https://github.com/Hooooong/DAY30_HttpSignin.git)

#### 공부정리
____________________________________________________

##### __MongoDB__

- MongoDB 란?

  > MongoDB 는 크로스 플랫폼 도큐먼트 지향 데이터베이스 시스템이다. NoSQL 데이터베이스로 분류되는 몽고DB는 JSON과 같은 동적 스키마형 문서들(몽고DB는 이러한 포맷을 BSON이라 부름)을 선호함에 따라 전통적인 테이블 기반 관계형 데이터베이스 구조의 사용을 삼간다. 이로써 특정한 종류의 애플리케이션을 더 쉽고 더 빠르게 데이터 통합을 가능케 한다. <br>몽고DB는 크레이그리스트, 이베이, 포스퀘어, 소스포지, 뉴욕 타임즈, 구글, 페이스북와 같은 수많은 주요 웹사이트 및 서비스에 백엔드 소프트웨어로 채택되고 있다. 몽고DB는 가장 유명한 NoSQL 데이터베이스 시스템이다.

  - MongoDB 는 NoSQL 이다. NoSQL 이란 전통적인 관계형 데이터베이스 보다 덜 제한적인 일관성 모델을 이용하는 데이터의 저장 및 검색을 위한 매커니즘을 제공한다.

- 참조 : [MongoDB](https://ko.wikipedia.org/wiki/%EB%AA%BD%EA%B3%A0DB), [NoSQL](https://ko.wikipedia.org/wiki/NoSQL)

##### __Node.js__

- GET 이외의 Body 처리

  - GET 는 주소창에 Query 형태로 값들이 전달된다.

  - GET 이외에 다른 Method 들은 Query 형태가 아닌 Body 에 담겨 들어온다.

  ```javascript
  // Body 의 값 추출
  var post_data ="";

  req.on('data', function(data){
    // 입력받은 data가 매개변수로 들어온다.
    post_data += data;
  });

  req.on('end', function(){
    // 1. 클라이언트에서 Query 형태로 보내는 경우
    // post_data = "id=root&&pw=qwer1234";
    var query = queryString.parse(post_data);
    // queryString.parse 를 통해 Object 로 변환

    // var query = {
    //   id : "root",
    //   pw : "qwer1234"
    // }

    // 2. 클라이언트에서 Json 형태로 보내는 경우
    // JSON.parse 를 통해 Object 로 변환
    var query = JSON.parse(postData);
    // var query = {
    //   id : "root",
    //   pw : "qwer1234"
    // }
  });
  ```

- MongoDB 와 Connect

  - 모듈 설정

  ```javascript
  // MongoDB 와 연결하는 모듈
  var mongo = require("mongodb").MongoClient;
  ```

  - 코드 설정

  ```javascript
  // Mongo DB 주소 구조 = 프로토콜://주소:포트:데이터베이스명
  mongo.connect("mongodb://localhost:27017/testdb", function(error, db){

    if(error){
      // DB 연결 실패
      // Error 처리
    }else{
      // DB 연결 성공
      // 검색의 Query 구조는 JSON 구조로 보내줘야 한다.
      // JSON Object : Javascript Object = 1:1 구조
      // 그러므로 Query 에 JSON 데이터를 직접 넣어주면 된다.
      var cursor = db.collections(테이블명).find(데이터);

      // 데이터 셋 처리 방법
      cursor.toArray(function(error, dataSet){
        if(dataSet.length > 0){
          // 성공적으로 데이터를 받았을 경우
          // 보낼 데이터를 Object 로 가공
          보낼 데이터;
        }

        req.write(JSON.stringify(보낼 데이터));
        req.end();
      });
    }
  }
  ```
