import {getOHLCData} from './services/yahooService';

getOHLCData({
    stock:'AJANTPHARM',
    startDate:new Date(2016,2,3),
    endDate:new Date(2016,2,4)
}).then(data => {
    console.log(data);
},error => {
    console.log(error);
});