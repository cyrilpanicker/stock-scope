/// <reference path="../../../typings/tsd.d.ts" />

import * as d3 from 'd3';
import {LinePlotData,plotLine} from '../services/LinePlot';
import {plotCandles} from '../services/CandlePlot';
import {plotDateAxis,plotValueAxis} from '../services/AxesPlot';
import {Candle} from '../../models/Candle';

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

interface Point{
    x:number;
    y:number;
}


export class Chart{

    private svg:d3.Selection<any>;
    private width:number;
    private height:number;
    private chartWidth:number;
    private chartHeight:number;
    private padding:Padding;
    private dateScale:d3.scale.Ordinal<string,number>;
    private valueScale:d3.scale.Linear<number,number>;
    private crossHair:d3.Selection<any>;
    private mouseMoveHandler:(date:string)=>void;
    
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
        this.trackMouseMove();
    }
    
    onMouseMove(handler:(date:string)=>void){
        this.mouseMoveHandler = handler;
    }
    
    getPoint(date:string,value:number){
        return {
            x:this.dateScale(date),
            y:-this.valueScale(value)
        };
    }
    
    getSlope(point1:Point,point2:Point){
        return (point2.y - point1.y)/(point2.x - point1.x);
    }
    
    plotLine(data:LinePlotData[],className:string,color:string){
        const {svg,dateScale,valueScale} = this;
        svg.selectAll(className).remove();
        const element = svg.append('g').attr('class',className);
        plotLine({element,color,data,dateScale,valueScale});
    }
    
    plotCandles(candles:Candle[],className:string){
        const {svg,dateScale,valueScale,chartWidth} = this;
        const candleWidth = 0.6 * chartWidth / candles.length;
        svg.selectAll(className).remove();
        const element = svg.append('g').attr('class',className);
        plotCandles({element,candles,dateScale,valueScale,candleWidth});
    }
    
    plotDateAxis(className:string){
        const {svg,dateScale,valueScale} = this;
        svg.selectAll(className).remove();
        const element = svg.append('g').attr('class',className);
        plotDateAxis({element,dateScale});
    }
    
    plotValueAxis(className:string,ticks:number){
        const {svg,dateScale,valueScale} = this;
        const translate = this.padding.left + this.chartWidth;
        svg.selectAll(className).remove();
        const element = svg.append('g')
            .attr('class',className)
            .attr('transform','translate('+translate+',0)');
        plotValueAxis({element,valueScale,ticks});
    }
    
    plotCrossHair(){
        const {svg,dateScale,height,width} = this;
        svg.selectAll('.cross-hair').remove();
        this.crossHair = this.svg.append('g').attr('class','cross-hair')
        this.crossHair.append('line').attr('id','x-cross-hair');
        this.crossHair.append('line').attr('id','y-cross-hair');
    }
    
    private trackMouseMove(){
        const {svg,dateScale,width,height} = this;
        const self = this;
        svg.on('mousemove',function(){
            if(self.mouseMoveHandler || self.crossHair){
                const [x,y] = d3.mouse(this);
                const date1 = dateScale.domain()[d3.bisect(dateScale.range(),x)];
                const date2 = dateScale.domain()[d3.bisect(dateScale.range(),x) - 1];
                const date = (dateScale(date1) - x) < (x - dateScale(date2)) ? date1 : date2;
                if(date){
                    if(self.mouseMoveHandler){
                        self.mouseMoveHandler(date);
                    }
                    if(self.crossHair){
                        self.crossHair.select('#y-cross-hair')
                            .attr('x1',dateScale(date)).attr('x2',dateScale(date))
                            .attr('y1',0).attr('y2',height);
                        self.crossHair.select('#x-cross-hair')
                            .attr('x1',0).attr('x2',width)
                            .attr('y1',y).attr('y2',y);
                    }
                }
            }
        });
    }
    
}