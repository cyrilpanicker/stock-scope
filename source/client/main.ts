/// <reference path="../../typings/tsd.d.ts" />

import * as $ from 'jquery';
import * as d3 from 'd3';
import {CandleArray} from '../models/CandleArray';
import {Candle} from '../models/Candle';
import {plotLinearValue} from './chartingPlugins/linearValuePlot';
    

$(() => {
    $.ajax({
        url:'/stockdata/KALPATPOWR',
        success:(data:any[])=>{
            const candleArray = new CandleArray(data);
            candleArray.addSMA(8).addSMA(21).addSMA(55);
            let candles = candleArray.getCandles();
            candles = candles.filter(candle => (!!candle.ma8 && !!candle.ma21 && !!candle.ma55));
            console.log(candles);
            const width = 1280;
            const height = 300;
            
            const priceScale = d3.scale.linear()
                .domain([d3.min(candles.map(candle => candle.low)),d3.max(candles.map(candle => candle.high))])
                .range([height,0]);

            const dateScale = d3.scale.ordinal<string,number>()
                .domain(candles.map(candle => candle.date))
                .rangePoints([0,width]);

//             const margin = 50;
//             const candleWidth = 0.5 * (width - 2*margin)/candles.length;
// 
//             const priceScale = d3.scale.linear()
//                 .domain([d3.min(candles.map(candle => candle.low)),d3.max(candles.map(candle => candle.high))])
//                 .range([height-margin,margin]);
// 
//             const dateScale = d3.scale.ordinal<string,number>()
//                 .domain(candles.map(candle => candle.date))
//                 .rangePoints([margin,width-margin]);
//                 
//             const smaList = [
//                 {property:'ma8',color:'red'},
//                 {property:'ma21',color:'blue'},
//                 {property:'ma55',color:'yellow'}
//             ];
            
            
            // const pathGenerator = d3.svg.line()
            //     .interpolate('cardinal');
            // 
            // const pathMapper = (sma) => {
            //     const coOrdinatesArray = candles.map(candle => {
            //         const coOrdinates:[number,number]=[0,0];
            //         coOrdinates[0] = dateScale(candle.date);
            //         coOrdinates[1] = priceScale(candle[sma.property]);
            //         return coOrdinates;
            //     });
            //     return pathGenerator(coOrdinatesArray);
            // };
            
            $('body').append('<div id="chart"></div>');
            
            const svg = d3.select('#chart').append('svg')
                .attr('width',width)
                .attr('height',height);
                
            // const paths = svg.selectAll('path').data(smaList);
            // paths.exit().remove();
            // paths.enter().append('path');
            // paths
            //     .attr('stroke',sma => sma.color)
            //     .attr('fill','none')
            //     .attr('d',pathMapper)
            plotLinearValue({
                color:'red',
                svg:svg,
                data:candles.map(candle => {
                    return {
                        ordinal:candle.date,
                        value:candle.ma8
                    };
                }),
                valueScale:priceScale,
                dateScale
            });
            plotLinearValue({
                color:'blue',
                svg:svg,
                data:candles.map(candle => {
                    return {
                        ordinal:candle.date,
                        value:candle.ma21
                    };
                }),
                valueScale:priceScale,
                dateScale
            });
            plotLinearValue({
                color:'yellow',
                svg:svg,
                data:candles.map(candle => {
                    return {
                        ordinal:candle.date,
                        value:candle.ma55
                    };
                }),
                valueScale:priceScale,
                dateScale
            });
        },
        error:(error) => {
            console.log(error);
        }
    });
});