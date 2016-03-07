/// <reference path="../typings/tsd.d.ts" />

import * as DB from './services/mongoDbService';
import * as Server from './server';

DB.connect()
.then(()=>{
    console.log('db connected.');
    return Server.start();
},()=>{
    return Promise.reject('db-error');
})
.then((port)=>{
    console.log('server listening at '+port+'.');
},error => {
    console.log(error);
});