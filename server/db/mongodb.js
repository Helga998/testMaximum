const { MongoClient } = require('mongodb');
const MongoUrl = 'mongodb://hrTest:hTy785JbnQ5@mongo0.maximum.expert:27423/?authSource=hrTest&replicaSet=ReplicaSet&readPreference=primary';
const dbName = 'hrTest';

async function connect() {
  const client = new MongoClient(MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  try{
    return await client.connect();
  } catch (error) {
    console.error('Ошибка, не смог подключиться к базе!!!', error);
    await client.close();
  }
}

async function getAllStock(stockCollection) {
  const stockData = await stockCollection.find({}).toArray();
  return stockData;
}

async function agregateStock(stockCollection) {
  const aggregationPipeline = [
    {
      $group: {
        _id: '$mark',       
        totalItems: { $sum: 1 } 
      }
    },
    {
      $sort: { _id: 1 } 
    }
  ];
   const result = await stockCollection.aggregate(aggregationPipeline).toArray();
   return result;
}

async function getAllData() {
  let result = {'all': [], 'agregated': []}
  try {
    const dbConnection = await connect();
    const db = dbConnection.db(dbName);
    const stockCollection = db.collection('stock');
    result['all'] = await getAllStock(stockCollection)
    result['agregated'] = await agregateStock(stockCollection)
    await dbConnection.close();
    return result
  } catch (error) {
    console.error('Ошибка, не смог получить данные', error);
  } 

}

module.exports = getAllData;
