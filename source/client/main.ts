/// <reference path="../../typings/tsd.d.ts" />

import * as $ from 'jquery';

$(() => {
    $.ajax({
        url:'/stockdata/INFY',
        success:(data:any[])=>{
            console.log(data.filter(datum => datum.ma55));
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