/// <reference path="../typings/tsd.d.ts" />

import * as express from 'express';

const PORT = 8080;

const app = express();

export const start = () => {
    return new Promise((resolve,reject) => {
        app.listen(PORT,()=>{
            resolve(PORT);
        });
    });
};

// import {getOHLCData} from './services/yahooService';
// 
// getOHLCData({
//     stock:'AJANTPHARM',
//     startDate:new Date(2016,2,3),
//     endDate:new Date(2016,2,4)
// }).then(data => {
//     console.log(data);
// },error => {
//     console.log(error);
// });
