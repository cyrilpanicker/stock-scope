/// <reference path="../../typings/tsd.d.ts" />

import {setStocksList} from './services/localDataService';
import {readFileAsync} from './services/promisifiedServices';
import * as Server from './webServer';

readFileAsync('./data/stocksList.json')

.then((data:string) => {
    setStocksList(JSON.parse(data));
    console.log('stocks-list has been set.');
    return Server.start();
},(error) => {
    return Promise.reject(error);
})

.then((port)=>{
    console.log('server listening at '+port+'.');
},error => {
    console.log(error);
});