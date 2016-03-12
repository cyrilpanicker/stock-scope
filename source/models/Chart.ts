/// <reference path="../../typings/tsd.d.ts" />

import {LinePlotData,plotLine} from '../chartingPlugins/LinePlot';
import {plotCandles} from '../chartingPlugins/CandlePlot';
import {Candle} from './Candle';

interface ChartConfig{
    svg:d3.Selection<any>;
    width:number;
    height:number;
    minValue:number;
    maxValue:number;
    dateArray:string[];
}

export class Chart{

    svg:d3.Selection<any>;
    width:number;
    height:number;
    dateScale:d3.scale.Ordinal<string,number>;
    valueScale:d3.scale.Linear<number,number>;
    static xBuffer = 10;

    constructor({svg,width,height,minValue,maxValue,dateArray}:ChartConfig){
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.svg.attr('width',width).attr('height',height);
        this.valueScale = d3.scale.linear().domain([minValue,maxValue]).range([height,0]);
        this.dateScale = d3.scale.ordinal<string,number>().domain(dateArray).rangePoints([Chart.xBuffer,width-Chart.xBuffer]);
    }
    
    plotLine(data:LinePlotData[],color:string){
        const {svg,dateScale,valueScale} = this;
        plotLine({color,data,dateScale,valueScale,svg});
    }
    
    plotCandles(candles:Candle[]){
        const {svg,dateScale,valueScale,width} = this;
        const candleWidth = 0.6 * width / candles.length;
        plotCandles({svg,candles,dateScale,valueScale,candleWidth});
    }
    
}