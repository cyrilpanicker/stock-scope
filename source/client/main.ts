/// <reference path="../../typings/tsd.d.ts" />

import * as $ from 'jquery';
import * as d3 from 'd3';
import {CandleList} from '../models/CandleList';
import {Candle} from '../models/Candle';
import {Chart} from './models/Chart';

require('./styles.css');
    

$(() => {
    $.ajax({
        url:'/stockdata/ASTRAL',
        success:(candles:Candle[])=>{

            const candleList:CandleList = new CandleList(candles);

            let sma8:any[] = candleList.getSMA(8);
            let sma21:any[] = candleList.getSMA(21);
            let sma55:any[] = candleList.getSMA(55);
            
            candles = candles.slice(-180);
            sma8 = sma8.slice(-180);
            sma21 = sma21.slice(-180);
            sma55 = sma55.slice(-180);
            
            $('body').append('<div id="chart"></div>');
            
            const chart = new Chart({
                svg:d3.select('#chart').append('svg'),
                width:1350,
                height:300,
                padding:{top:0,right:70,bottom:0,left:0},
                dateArray:candles.map(candle => candle.date),
                minValue:d3.min(candles.map(candle => candle.low)),
                maxValue:d3.max(candles.map(candle => candle.high))
            });
            
            chart.plotPivots(new CandleList(candles).getPivots().highs,'pivot-highs','red','high');
            chart.plotPivots(new CandleList(candles).getPivots().lows,'pivot-lows','blue','low');
            
            chart.plotDateAxis('date-axis');
            chart.plotValueAxis('price-axis',10);
            // chart.plotSupportLines(candles);
            chart.plotCandles(candles,'price-chart');
            // chart.plotCurve(candles.map(candle => {return {
            //     date:candle.date,
            //     value:candle.low
            // }}),'price-chart','yellow');
            // chart.plotCurve(candles.map(candle => {return {
            //     date:candle.date,
            //     value:candle.high
            // }}),'price-chart','steelblue');
            // chart.plotCurve(sma8,'price-sma-8','red');
            // chart.plotCurve(sma21,'price-sma-21','blue');
            // chart.plotCurve(sma55,'price-sma-55','yellow');
            
            
            
            chart.plotCrossHair();
        },
        error:(error) => {
            console.log(error);
        }
    });
});