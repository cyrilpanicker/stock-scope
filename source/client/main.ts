/// <reference path="../../typings/tsd.d.ts" />

import * as $ from 'jquery';

$(() => {
    $.ajax({
        url:'stockdata/INFY',
        success:(data)=>{
            console.log(data);
        },
        error:(error) => {
            console.log(error);
        }
    });
});