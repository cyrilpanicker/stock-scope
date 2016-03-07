/// <reference path="../typings/tsd.d.ts" />

import * as express from 'express';
import * as dataService from './services/localDataService';

const PORT = 8080;

const app = express();

app.use(express.static('./build/client/public'));

app.get('/stockdata/:stock',(request,response) => {
    dataService.getStockData({
        stock:request.params.stock,
        startDate:new Date(2016,1,29),
        endDate:new Date(2016,2,4)
    }).then((data) => {
        response.send(data);
    },(error) => {
        response.status(500).send(error);
    });
});

export const start = () => {
    return new Promise((resolve,reject) => {
        app.listen(PORT,()=>{
            resolve(PORT);
        });
    });
};