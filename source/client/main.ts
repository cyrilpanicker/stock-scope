/// <reference path="../../typings/tsd.d.ts" />

import * as $ from 'jquery';
import * as d3 from 'd3';
import {CandleList} from '../models/CandleList';
import {Candle} from '../models/Candle';
import {Chart} from '../models/Chart';
    

$(() => {
    $.ajax({
        url:'/stockdata/GDL',
        success:(candles:Candle[])=>{

            const candleList:CandleList = new CandleList(candles);

            let sma8:any[] = candleList.getSMA(8);
            let sma21:any[] = candleList.getSMA(21);
            const sma55:any[] = candleList.getSMA(55);
            
            const dateList = sma55.map(value => value.date);
            
            candles = candles.filter(candle => dateList.indexOf(candle.date)>-1);
            sma8 = sma8.filter(node => dateList.indexOf(node.date)>-1);
            sma21 = sma21.filter(node => dateList.indexOf(node.date)>-1);
            
            console.log(candles);
            
            $('body').append('<div id="chart"></div>');
            
            const chart = new Chart({
                svg:d3.select('#chart').append('svg'),
                width:1280,
                height:400,
                dateArray:candles.map(candle => candle.date),
                minValue:d3.min(candles.map(candle => candle.low)),
                maxValue:d3.max(candles.map(candle => candle.high))
            });
            
            chart.plotCandles(candles);
            
            chart.plotLine(sma8,'red');
            chart.plotLine(sma21,'blue');
            chart.plotLine(sma55,'yellow');
            

        },
        error:(error) => {
            console.log(error);
        }
    });
});