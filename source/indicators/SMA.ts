/// <reference path="../../typings/tsd.d.ts" />

import {assign} from 'underscore';

const average = function(data:number[]){
    const total = data.reduce((last,current) => last + current);
    const average = total/data.length;
    // console.log(data.join()+' : '+average);
    return average;
	// return data.reduce(function(last,current,currentIndex){
	// 	return (last*(currentIndex) + current)/(currentIndex+1);
	// });
};

export const addSMA = function({data,property,period}){
    
    for (var index = 0; index < data.length; index++) {
        if(index >= period-1){
            const slice = data.slice(index+1-period,index+1).map(datum => datum[property]);
            data[index]['ma'+period] = average(slice);
        }
    }
    
    // return data.map((datum,index) => {
    //     if(index < period-1){
    //         return assign({},datum);
    //     } else {
    //         const newDatum = assign({},datum);
    //         newDatum['ma'+period] = average(
    //             data.slice(index+1-period,index+1).map(datum => datum[property])
    //         );
    //         return newDatum;
    //     }
    // });
}

// const input = [
//     {close:1},
//     {close:2},
//     {close:3},
//     {close:4},
//     {close:5},
//     {close:6},
//     {close:7},
//     {close:8},
//     {close:9},
//     {close:10},
//     {close:1},
//     {close:2},
//     {close:3},
//     {close:4},
//     {close:5},
//     {close:6},
//     {close:7},
//     {close:8},
//     {close:9},
//     {close:10}
// ];
// 
// var output = addSMA({
//     data:input,
//     property:'close',
//     period:3
// })
// 
// console.log(input)