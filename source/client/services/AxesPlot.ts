/// <reference path="../../../typings/tsd.d.ts" />
import * as d3 from 'd3';
import * as moment from 'moment';

export interface DateAxisPlotConfig{
    svg:d3.Selection<any>;
    dateScale:d3.scale.Ordinal<string,number>;
}

export interface ValueAxisPlotConfig{
    svg:d3.Selection<any>;
    valueScale:d3.scale.Linear<number,number>;
    translate:number;
}


export const plotDateAxis = ({svg,dateScale}:DateAxisPlotConfig) => {
    const dateAxis =  d3.svg.axis()
        .scale(dateScale)
        .tickValues(dateScale.domain().filter((_,index,array) => !(index%5) || index == array.length-1))
        .tickFormat(dateString => moment(dateString).format('M/D'));
    svg.append('g')
        .attr('class','date-axis')
        .call(dateAxis);
    
};

export const plotValueAxis = ({svg,valueScale,translate}:ValueAxisPlotConfig) => {
    const valueAxis = d3.svg.axis()
        .scale(valueScale)
        .orient('right')
        .ticks(10);
    svg.append('g')
        .attr('class','price-axis')
        .attr('transform','translate('+translate+',0)')
        .call(valueAxis);
};