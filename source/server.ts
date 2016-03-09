/// <reference path="../typings/tsd.d.ts" />

import * as express from 'express';
import {getAllIndustries} from './services/localDataService';
import {getCandleData} from './services/quandlService';

const PORT = 8080;

const app = express();

app.use(express.static('./build/client/public'));

app.get('/stockdata/:stock',(request,response) => {
    getCandleData({
        stock:request.params.stock,
        endDate:new Date()
    }).then(candleData => {
        candleData.addSMA(8).addSMA(21).addSMA(55);
        response.send(candleData.getCandles());
    },(error) => {
        response.status(500).send(error);
    });
});

app.get('/industries',(request,response) => {
    response.send(getAllIndustries());
});

export const start = () => {
    return new Promise((resolve,reject) => {
        app.listen(PORT,()=>{
            resolve(PORT);
        });
    });
};