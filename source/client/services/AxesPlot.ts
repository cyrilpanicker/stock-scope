/// <reference path="../../../typings/tsd.d.ts" />
import * as d3 from 'd3';
import * as moment from 'moment';

interface DateAxisPlotConfig{
    element:d3.Selection<any>;
    dateScale:d3.scale.Ordinal<string,number>;
}

interface ValueAxisPlotConfig{
    element:d3.Selection<any>;
    valueScale:d3.scale.Linear<number,number>;
    ticks:number;
}


export const plotDateAxis = ({element,dateScale}:DateAxisPlotConfig) => {
    const dateAxis =  d3.svg.axis()
        .scale(dateScale)
        .tickValues(dateScale.domain().filter((_,index,array) => !(index%5) || index == array.length-1))
        .tickFormat(dateString => moment(dateString).format('M/D'));
    dateAxis(element);
    
};

export const plotValueAxis = ({element,valueScale,ticks}:ValueAxisPlotConfig) => {
    const valueAxis = d3.svg.axis()
        .scale(valueScale)
        .orient('right')
        .ticks(ticks);
    valueAxis(element);
};