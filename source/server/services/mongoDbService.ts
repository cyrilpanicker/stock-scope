/// <reference path="../../../typings/tsd.d.ts" />

import {Db,Server,MongoClient} from 'mongodb';

const HOST = 'localhost';
const PORT = 27017;
const DATABASE = 'stocks-scope';

const CONNECTION_STRING = 'mongodb://<HOST>:<PORT>/<DATABASE>'
    .replace('<HOST>',HOST)
    .replace('<PORT>',PORT.toString())
    .replace('<DATABASE>',DATABASE);

let DB:Db = null;

export const connect = () => {
    return new Promise((resolve,reject) => {
        MongoClient.connect(CONNECTION_STRING,null,(error,db)=>{
            if(error){
                reject();
            } else {
                DB = db;
                resolve();
            }
        });
    });
};

export const get = (collection,pattern) => {
    return new Promise((resolve,reject) => {
        DB.collection(collection).find(pattern).toArray((error,result) => {
            if(error){
                reject();
            } else {
                resolve(result);
            }
        });
    });
};