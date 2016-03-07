/// <reference path="../../typings/tsd.d.ts" />

import * as yahoo from './yahooService';
import * as DB from './mongoDbService';

export const getStockData = yahoo.getHistoricData;

export const getAllIndustries = () => {
    const industries = []; 
    return DB.get('nifty500',{}).then((stocks:any[])=>{
        stocks.forEach(stock => {
            if(industries.indexOf(stock.industry) === -1){
                industries.push(stock.industry);
            }
        });
        return Promise.resolve(industries);
    },()=>{
        return Promise.reject('db-error');
    });
};