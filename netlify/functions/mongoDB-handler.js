const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  let client;
  try {
    client = await MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true });
    const db = client.db(process.env.MONGO_DB_NAME);
    const collection = db.collection('location');

    const data = JSON.parse(event.body);

    if (data.action === 'add') {
      const { name, latitude, longitude } = data;

      // 컬렉션에 지도 정보를 추가
      await collection.insertOne({ name, latitude, longitude });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data saved successfully' }),
      };
    } else if (data.action === 'get_all') {
      // 컬렉션에서 지도 정보를 가져옴
      const docs = await collection.find().toArray();

      return {
        statusCode: 200,
        body: JSON.stringify(docs),
      };
    } else if (data.action === 'delete') {
      const { _id } = data;

      //컬렉션에서 지도 정보를 삭제함
      await collection.deleteOne({ _id });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data deleted successfully' }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid action' }),
      };
    }
  } catch (error) {
    console.error('Error in mongo-handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred in the server.' }),
    };
  } finally {
    if (client) {
      // close the MongoDB connection
      await client.close();
    }
  }
};


/* 
환경 변수 MONGO_URI와 MONGO_DB_NAME을 설정해야 합니다.(-->  netlify에서 설정함.)
MONGO_URI는 MongoDB 클러스터의 주소이며, MONGO_DB_NAME은 사용할 데이터베이스의 
이름입니다.

위 코드를 적용한 후 MongoDB 클러스터를 생성하고, 생성한 클러스터의 주소를 
MONGO_URI 환경 변수에 할당하면 됩니다. MongoDB에서 데이터를 저장하고 
검색하는 방법은 SQLite와는 다릅니다. MongoDB는 document 기반의 NoSQL 
데이터베이스이며, 콜렉션에 document를 저장하고, 콜렉션에서 document를 검색합니다.

따라서 SQLite에서 테이블을 생성하고 데이터를 삽입하는 것처럼 MongoDB에서는 
콜렉션을 생성하고 document를 삽입하는 것입니다. 위 코드에서는 map_info라는 
이름의 콜렉션을 생성하고, insertOne() 메서드를 사용하여 document를 추가합니다. 
document의 내용은 { name, latitude, longitude }와 같이 객체 형태로 지정합니다.

모든 document를 검색할 때는 find() 메서드를 사용하고, toArray() 메서드를 
사용하여 document의 배열을 얻습니다. 이 배열을 JSON 형태로 변환하여 
HTTP 응답으로 반환합니다.
*/