/// <reference path="../../typings/tsd.d.ts" />

import * as $ from 'jquery';
import * as d3 from 'd3';
import {CandleList} from '../models/CandleList';
import {Candle} from '../models/Candle';
import {Chart} from './models/Chart';

require('./styles.css');
    
const stock = window.location.hash ? window.location.hash.substring(1):'INFY';

$(() => {
    $.ajax({
        url:'/stockdata/'+stock,
        success:(candles:Candle[])=>{

            const candleList:CandleList = new CandleList(candles);

            let sma8:any[] = candleList.getSMA(8);
            let sma21:any[] = candleList.getSMA(21);
            let sma55:any[] = candleList.getSMA(55);
            
            candles = candles.slice(-180);
            sma8 = sma8.slice(-180);
            sma21 = sma21.slice(-180);
            sma55 = sma55.slice(-180);
            const pivots = new CandleList(candles).getPivots();
            
            const width = 1333;
            const height = 700;
            const padding = {left:10,right:60};
            const chartWidth = width - padding.left - padding.right;
            const candleWidth = 0.6 * chartWidth / candles.length;
            

            $('body').append('<div id="chart"></div>');

            const chart = new Chart({
                svg:d3.select('#chart').append('svg'),
                width:width,
                height:height,
                padding:padding,
                dateArray:candles.map(candle => candle.date),
                slabs:[{
                    height:300,
                    minValue:d3.min(candles.map(candle => candle.low)),
                    maxValue:d3.max(candles.map(candle => candle.high)),
                    padding:{top:30,bottom:0}
                },{
                    height:100,
                    minValue:d3.min(candles.map(candle => candle.volume)),
                    maxValue:d3.max(candles.map(candle => candle.volume)),
                    padding:{top:10,bottom:0}
                }]
            });

            chart.plotDateAxis('date-axis');
            
            chart.plotValueAxis('price-axis',10,0);
            chart.plotCurve(sma8,'sma8','red',0);
            chart.plotCurve(sma21,'sma8','blue',0);
            chart.plotCurve(sma55,'sma8','yellow',0);
            chart.plotCandles(candles,'price-chart',0);
            
            chart.plotValueAxis('volume-axis',5,1);
            chart.plotBars(candles.map(candle=>{
                return {date:candle.date,value:candle.volume};
            }),'volume-chart',1)
            
            chart.plotCrossHair();
            
            chart.onMouseMove(date => {
                const candle = candles.filter(candle=>candle.date==date)[0];
                const ohlcText = 'OPEN : '+candle.open+
                    ',       HIGH : '+candle.high+
                    ',       LOW : '+candle.low+
                    ',       CLOSE : '+candle.close;
                chart.plotInfo(ohlcText,'ohlc-info',0);
                chart.plotInfo('VOLUME:'+candle.volume,'volume-info',1);
            });

        },
        error:(error) => {
            console.log(error);
        }
    });
});