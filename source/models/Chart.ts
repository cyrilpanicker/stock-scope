/// <reference path="../../typings/tsd.d.ts" />

import * as d3 from 'd3';
import {LinePlotData,plotLine} from '../chartingPlugins/LinePlot';
import {plotCandles} from '../chartingPlugins/CandlePlot';
import {plotDateAxis,plotValueAxis} from '../chartingPlugins/AxesPlot';
import {Candle} from './Candle';

interface Padding{
    top:number;
    right:number;
    bottom:number;
    left:number;
}

interface ChartConfig{
    svg:d3.Selection<any>;
    width:number;
    height:number;
    padding:Padding;
    minValue:number;
    maxValue:number;
    dateArray:string[];
}

export class Chart{

    svg:d3.Selection<any>;
    width:number;
    height:number;
    chartWidth:number;
    chartHeight:number;
    padding:Padding;
    dateScale:d3.scale.Ordinal<string,number>;
    valueScale:d3.scale.Linear<number,number>;
    crossHair:d3.Selection<any>;
    static xBuffer = 10;

    constructor({svg,width,height,padding,minValue,maxValue,dateArray}:ChartConfig){
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.svg.attr('width',width).attr('height',height);
        this.chartWidth = width - padding.left - padding.right;
        this.chartHeight = height - padding.top - padding.bottom;
        this.padding = padding;
        this.valueScale = d3.scale.linear().domain([minValue,maxValue]).range([height-padding.bottom,padding.top]);
        this.dateScale = d3.scale.ordinal<string,number>().domain(dateArray).rangePoints([Chart.xBuffer+padding.left,width-Chart.xBuffer-padding.right]);
        this.crossHair = svg.append('g');
        this.crossHair.append('line').attr('class','cross-hair').attr('id','x-cross-hair');
        this.crossHair.append('line').attr('class','cross-hair').attr('id','y-cross-hair');
        this.trackMouseMovement(svg);
    }
    

    
    private trackMouseMovement(svg) {
        const self = this;
        svg.on('mousemove',function(){
            const [xFocus,yFocus] = d3.mouse(this);
            const focusedValue = self.valueScale.invert(yFocus);
            const focusedDate = self.dateScale.domain()[d3.bisect(self.dateScale.range(),xFocus)];
            self.crossHair.select('#y-cross-hair')
                .attr('x1',self.dateScale(focusedDate)).attr('x2',self.dateScale(focusedDate))
                .attr('y1',0).attr('y2',self.height);
            self.crossHair.select('#x-cross-hair')
                .attr('x1',0).attr('x2',self.width)
                .attr('y1',yFocus).attr('y2',yFocus);
            console.log(focusedDate+', '+focusedValue);
        });
    } 
    
    plotLine(data:LinePlotData[],color:string){
        const {svg,dateScale,valueScale} = this;
        plotLine({color,data,dateScale,valueScale,svg});
    }
    
    plotCandles(candles:Candle[]){
        const {svg,dateScale,valueScale,chartWidth} = this;
        const candleWidth = 0.6 * chartWidth / candles.length;
        plotCandles({svg,candles,dateScale,valueScale,candleWidth});
    }
    
    plotAxes(){
        const {svg,dateScale,valueScale} = this;
        const translate = this.padding.left + this.chartWidth;
        plotDateAxis({svg,dateScale});
        plotValueAxis({svg,valueScale,translate});
    }
    
}