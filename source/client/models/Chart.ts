/// <reference path="../../../typings/tsd.d.ts" />

import * as d3 from 'd3';
import {CurvePlotData,plotCurve} from '../services/CurvePlot';
import {plotCandles} from '../services/CandlePlot';
import {plotDateAxis,plotValueAxis} from '../services/AxesPlot';
import {Candle} from '../../models/Candle';
import * as moment from 'moment';

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
    
    getLine(point1:Point,point2:Point){
        const slope = (point2.y - point1.y)/(point2.x - point1.x);
        return {
            slope,
            intercept: point1.y - slope*point1.x
        };
    }
    
    plotCurve(data:CurvePlotData[],className:string,color:string){
        const {svg,dateScale,valueScale} = this;
        svg.selectAll(className).remove();
        const element = svg.append('g').attr('class',className);
        plotCurve({element,color,data,dateScale,valueScale});
    }
    
    plotCandles(candles:Candle[],className:string){
        const {svg,dateScale,valueScale,chartWidth} = this;
        const candleWidth = 0.6 * chartWidth / candles.length;
        svg.selectAll(className).remove();
        const element = svg.append('g').attr('class',className);
        plotCandles({element,candles,dateScale,valueScale,candleWidth});
    }
    
    plotPivots(candles:Candle[],className:string,color:string,property:string){
        const {svg,dateScale,valueScale,chartWidth} = this;
        const candleWidth = 4.266666666666667;
        svg.selectAll(className).remove();
        const element = svg.append('g').attr('class',className);
        const lines = element.selectAll('line').data(candles);
        lines.enter().append('line');
        lines
            .attr('y1',datum => valueScale(datum[property]))
            .attr('y2',datum => valueScale(datum[property]))
            .attr('x1',datum => dateScale(datum.date)-2.5*candleWidth)
            .attr('x2',datum => dateScale(datum.date)+2.5*candleWidth)
            .attr('stroke',color)
            .style('stroke-dasharray',('3,3'));
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
        this.crossHair.append('text').attr('class','x-value');
        this.crossHair.append('text').attr('class','y-value');
    }
    
    plotResistanceLines(candles:Candle[]){
        for(let i = 0; i<candles.length-1 ; i++){
            const point1 = this.getPoint(candles[i].date,candles[i].low);
            for(let j=i+1; j<candles.length; j++){
                let point2 = this.getPoint(candles[j].date,candles[j].low);
                let line = this.getLine(point1,point2);
                for(let k=i+1;k<=j-1;k++){
                    let point12 = this.getPoint(candles[k].date,candles[k].low);
                    let distance = (point12.x*line.slope+line.intercept) - point12.y;
                    if(distance > -0.0001 && distance < 0.0001){
                        let point3;
                        if(line.slope === 0){
                            console.log(candles[i].date+', '+candles[k].date+', '+candles[j].date);
                            point3 = {x:this.width,y:line.intercept};
                            this.plotLine(point1,point3,'support','black');
                        } else if (line.slope > 0 ) {
                            point3 = {x:-line.intercept/line.slope,y:0};
                            this.plotLine(point1,point3,'up-trend','#DCD9CD');
                        } else {
                            point3 = {x:(-this.height+this.padding.bottom-line.intercept)/line.slope,y:-this.height+this.padding.bottom};
                            //this.plotLine(point1,point3,'down-trend','cyan');
                        }
                    }
                }
            }
        }
    }
    
    plotSupportLines(candles:Candle[]){
        
        const lines = [];

        for(let i = 0; i<candles.length-1 ; i++){
            const point1 = this.getPoint(candles[i].date,candles[i].low);
            for(let j=i+1; j<candles.length; j++){

                let point3;
                let point2 = this.getPoint(candles[j].date,candles[j].low);
                let line = this.getLine(point1,point2);
                for(let k=i+1;k<=j-1;k++){
                    let point12 = this.getPoint(candles[k].date,candles[k].low);
                    let delta = (point12.x*line.slope+line.intercept) - point12.y;
                    if(delta > -0.00001 && delta < 0.00001){
                        if(line.slope === 0){
                            point3 = {x:this.width,y:line.intercept};
                            lines.push({point1,point12,point3});
                        } else if (line.slope > 0 ) {
                            point3 = {x:-line.intercept/line.slope,y:0};
                            lines.push({point1,point12,point3});
                        }
                    }
                    // if(distance > -0.00001 && distance < 0.00001){
                    //     let point3;
                    //     if(line.slope === 0){
                    //         point3 = {x:this.width,y:line.intercept};
                    //         this.plotLine(point1,point3,'support','black');
                    //     } else if (line.slope > 0 ) {
                    //         point3 = {x:-line.intercept/line.slope,y:0};
                    //         this.plotLine(point1,point3,'support-trend','#DCD9CD');
                    //     } else {
                    //         // point3 = {x:(-this.height+this.padding.bottom-line.intercept)/line.slope,y:-this.height+this.padding.bottom};
                    //         // this.plotLine(point1,point3,'down-trend','#DCD9CD');
                    //     }
                    // }
                }
                
                point2 = this.getPoint(candles[j].date,candles[j].high);
                line = this.getLine(point1,point2);
                for(let k=i+1;k<=j-1;k++){
                    let point12 = this.getPoint(candles[k].date,candles[k].low);
                    let distance = (point12.x*line.slope+line.intercept) - point12.y;
                    if(distance > -0.00001 && distance < 0.00001){
                        if(line.slope === 0){
                            point3 = {x:this.width,y:line.intercept};
                            lines.push({point1,point12,point3});
                        } else if (line.slope > 0 ) {
                            point3 = {x:-line.intercept/line.slope,y:0};
                            lines.push({point1,point12,point3});
                        }
                    }
                }


            }
        }
        
        for(let i = 0; i<lines.length ; i++){
            let priority;
            let color;
            var {point1,point12,point3} = lines[i];
            if(point1.y === point3.y){
                priority = 3;
            } else {
                priority = lines.filter(function(line){
                    return line.point1.x === point1.x &&
                    line.point1.y === point1.y &&
                    line.point3.x === point3.x &&
                    line.point3.y === point3.y;
                }).length;
            }
            lines[i].priority = priority;
        }
        // lines.filter(line => line.priority===1).forEach(line => {
        //     const {point1,point3} = line;
        //     this.plotLine(point1,point3,'support','#DCD9CD');
        // });
        lines.filter(line => line.priority!==1).forEach(line => {
            const {point1,point3} = line;
            this.plotLine(point1,point3,'support','black');
            console.log(line);
        });
    }
    
    plotLine(point1:Point,point2:Point,className:string,color:string){
        this.svg.append('g')
            .attr('class',className)
            .append('line')
                .attr('x1',point1.x)
                .attr('y1',-point1.y)
                .attr('x2',point2.x)
                .attr('y2',-point2.y)
                .attr('stroke',color)
                .style('stroke-dasharray',('3,3'))
                .style('stroke-opacity', 0.9);
    }
    
    private trackMouseMove(){
        const {svg,dateScale,valueScale,width,height,padding} = this;
        const self = this;
        svg.on('mousemove',function(){
            if(self.mouseMoveHandler || self.crossHair){
                const [x,y] = d3.mouse(this);
                const date1 = dateScale.domain()[d3.bisect(dateScale.range(),x)];
                const date2 = dateScale.domain()[d3.bisect(dateScale.range(),x) - 1];
                const date = (dateScale(date1) - x) < (x - dateScale(date2)) ? date1 : date2;
                const value = valueScale.invert(y);
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
                        self.crossHair.select('.y-value')
                            .attr('x',width-padding.right+30)
                            .attr('y',y)
                            .attr('font-size',10)
                            .text(Math.round(value*100)/100);
                        self.crossHair.select('.x-value')
                            .attr('x',x)
                            .attr('y',padding.top+25)
                            .attr('font-size',10)
                            .text(moment(date).format('M/D'));
                    }
                }
            }
        });
    }
    
}