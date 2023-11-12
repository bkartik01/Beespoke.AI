const fs = require('fs');
const xlsx = require('xlsx');
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection string
const mongoURI = 'uri';
const dbName = 'test'; // Replace with your actual database name
const collectionName = 'catalog'; // Replace with your actual collection name

// Path to your Excel file

const excelFilePath = 'D:\\product_catalog.xlsx';

// Connection to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;

  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Read the Excel file
  const workbook = xlsx.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet

  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  // Insert data into MongoDB
  collection.insertMany(data, (error, result) => {
    if (error) console.error(error);
    console.log('Data uploaded to MongoDB successfully.');
    client.close();
  });
});
