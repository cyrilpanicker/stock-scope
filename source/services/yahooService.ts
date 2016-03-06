/// <reference path="../../typings/tsd.d.ts" />

import * as request from 'request';
import * as moment from 'moment';

const uri = 'https://query.yahooapis.com/v1/public/yql';
const env = 'store://datatables.org/alltableswithkeys';
const format = 'json';
const query = 'select * from yahoo.finance.historicaldata'+
    ' where symbol = "<STOCK>.NS"'+
    ' and startDate = "<START-DATE>"'+
    ' and endDate = "<END-DATE>"';
    
const transformOHLCData = ({Symbol,Date,Open,High,Low,Close,Volume}) => {
    return {
        symbol:Symbol.substring(0,Symbol.indexOf('.NS')),
        date:moment(Date).toDate(),
        open:parseFloat(Open),
        high:parseFloat(High),
        low:parseFloat(Low),
        close:parseFloat(Close),
        volume:parseFloat(Volume)
    };
};

export const getOHLCData = ({stock,startDate,endDate}) => {

    const q = query
        .replace('<STOCK>',stock)
        .replace('<START-DATE>',moment(startDate).format('YYYY-MM-DD'))
        .replace('<END-DATE>',moment(endDate).format('YYYY-MM-DD'));

    return new Promise((resolve,reject) => {
        request({uri,qs:{env,format,q},json:true},(error, response, body) => {
            if(error){
                reject(error);
            } else {
                if(body.query.count === 0){
                    resolve([]);
                } else {
                    resolve(body.query.results.quote.map(datum => transformOHLCData(datum)));
                }
            }
        });
    });

};