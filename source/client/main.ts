/// <reference path="../../typings/tsd.d.ts" />

import * as $ from 'jquery';

$(() => {
    $.ajax({
        url:'/stockdata/INFY',
        success:(data:any[])=>{
            console.log(data.length);
            const filteredData = data.filter(datum => datum.ma55);
            console.log(filteredData.length);
            console.log(filteredData)
        },
        error:(error) => {
            console.log(error);
        }
    });
    $.ajax({
        url:'/industries',
        success:(data)=>{
            console.log(data);
        },
        error:(error) => {
            console.log(error);
        }
    });
});