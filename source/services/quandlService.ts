/// <reference path="../../typings/tsd.d.ts" />

//3, 5, 8, 13, 21, 34, 55, 89

import * as request from 'request';
import * as moment from 'moment';
import {CandleArray} from '../models/CandleArray';

const URI = 'https://www.quandl.com/api/v3/datasets/NSE/<STOCK>.json';
const API_KEY = 'kxeEoL4RejR54Ae4VPPg';
const CANDLES_TO_DISPLAY = 180;
const MA1 = 8;
const MA2 = 21;
const MA3 = 55;
const CANDLES_TO_FETCH = CANDLES_TO_DISPLAY + MA3 - 1;
//const START_DATE_OFFSET = CANDLES_TO_FETCH * 1.5;
    
const transformCandleData = (symbol) => {
    return (datum) => {
        return {
            symbol,
            date:datum[0],
            open:datum[1],  
            high:datum[2],
            low:datum[3],
            close:datum[4],
            volume:datum[6],
            turnover:datum[7]
        }
    };
};

export const getCandleData = ({stock,endDate}) => {
    return new Promise<CandleArray>((resolve,reject) => {
        request({
            uri:URI.replace('<STOCK>',stock),
            qs:{
                'limit':CANDLES_TO_FETCH,
                'api_key':API_KEY,
                'end_date':moment(endDate).format('YYYY-MM-DD')
                //,'start_date':moment(endDate).subtract(START_DATE_OFFSET,'days').format('YYYY-MM-DD')
            },
            json:true
        },(error, response, body) => {
            if(error){
                reject(error);
            } else if(body.quandl_error){
                reject('stock-invalid')
            } else if(!body.dataset || !body.dataset.data) {
                reject('unexpcted-error')
            } else if(body.dataset.data.length < CANDLES_TO_FETCH){
                reject('insufficient-data')
            } else{
                if(body.dataset.data.some(datum => !datum[6])){
                    reject('zero-volume-candle-found');
                } else {
                    resolve(new CandleArray(
                        body.dataset.data
                            .map(transformCandleData(body.dataset.dataset_code))
                            .reverse()
                    ));
                }
            }
        });
    });
};

// getCandleData({
//     stock:'GDL',
//     endDate:new Date(2016,2,8)
// }).then(console.log,console.log);