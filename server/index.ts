import express from 'express';
import bodyParser = require('body-parser');
// import { tempData } from './temp-data';
//import {firstTimeInsert} from './utils/mongoose-utils';
import {Ticket} from '../client/src/api';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import {Tickets} from "./models/tickets";
import mongoose from 'mongoose'
const PAGE_SIZE = 5;

const app = express();
app.use(bodyParser.json());

app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

let tempData: Ticket[] = [];
mongoose.connect('mongodb+srv://root:pUQDx3ZE7tZwWvcB@hadar-db.icesk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true}, async () =>{
  //await firstTimeInsert();  //I already done that
  console.log("loading data...");
  tempData = await Tickets.find({}).lean();
  
  

app.get(APIPath, (req, res) => {
  // @ts-ignore
  const page: number = req.query.page || 1;
  const searchParam: string = req.query.search as string;
  if (searchParam) {
    const filteredData = tempData.filter(item => (item.title + item.content).toLowerCase().includes(searchParam.toLowerCase()));
    const data = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return res.send({tickets: data, total: filteredData.length / PAGE_SIZE});
  }

  const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  res.send({tickets:paginatedData, total:tempData.length / PAGE_SIZE});
});

/*app.get(APIPath, async (req, res) => {
  // @ts-ignore
  const page: number = req.query.page || 1;
  const searchParam: string = req.query.search as string;
  if (searchParam) {    
    const data = await Tickets.find({"$or":[{"title" : {$regex : ".*"+searchParam+".*"}},{"content" : {$regex : ".*"+searchParam+".*"}}]}).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean();
    const count = await Tickets.find({"$or":[{"title" : {$regex : ".*"+searchParam+".*"}},{"content" : {$regex : ".*"+searchParam+".*"}}]}).count();

    //const filteredData = tempData.filter(item => (item.title + item.content).toLowerCase().includes(searchParam.toLowerCase()));
   // const data = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return res.send({tickets: data, total: count / PAGE_SIZE});
  }

  const paginatedData = await Tickets.find({}).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean();
  //const paginatedData = tempData.find({item => (item.title + item.content).toLowerCase().includes(searchParam.toLowerCase())}).skip((page - 1) * PAGE_SIZE).limit( page * PAGE_SIZE);
  res.send({tickets:paginatedData, total:tempData.length / PAGE_SIZE});
});*/

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)
});

console.log('starting server', { serverAPIPort, APIPath });