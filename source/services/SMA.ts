/// <reference path="../../typings/tsd.d.ts" />

const getAverage = (data:number[]) => {
    return data.reduce((last,current) => last + current)/data.length;
};

export const getSMA = (data:any[],valueProperty:string,period:number) => {
    let SMA = [];
    data.forEach((datum,index) => {
        if(index >= period-1){
            const SMANode:any = {};
            SMANode.date = datum.date;
            SMANode.value = getAverage(data.slice(index+1-period,index+1).map(datum => datum[valueProperty]))
            SMA.push(SMANode);
        }
    });
    return SMA;
}


// const input = [
//     {month:'A',close:1},
//     {month:'B',close:2},
//     {month:'C',close:3},
//     {month:'D',close:4},
//     {month:'E',close:5},
//     {month:'F',close:6},
//     {month:'G',close:7},
//     {month:'H',close:8},
//     {month:'I',close:9},
//     {month:'J',close:10},
//     {month:'K',close:1},
//     {month:'L',close:2},
//     {month:'M',close:3},
//     {month:'N',close:4},
//     {month:'O',close:5},
//     {month:'P',close:6},
//     {month:'Q',close:7},
//     {month:'R',close:8},
//     {month:'S',close:9},
//     {month:'T',close:10}
// ];
// 
// var smas = getSMA(input,'month','close',3);
// 
// console.log(smas)