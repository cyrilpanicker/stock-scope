/// <reference path="../../typings/tsd.d.ts" />
import * as d3 from 'd3';

export interface LinePlotData{
    date:string,
    value:number
}

export interface LinePlotConfig{
    svg:d3.Selection<any>;
    data:LinePlotData[];
    color:string;
    valueScale:d3.scale.Linear<number,number>;
    dateScale:d3.scale.Ordinal<string,number>;
}

export const plotLine = ({svg,data,color,valueScale,dateScale}:LinePlotConfig) => {
        
    const pathGenerator = d3.svg.line().interpolate('linear');
    
    const pathMapper = () => {
        const coOrdinatesArray = data.map(datum => {
            const coOrdinates:[number,number]=[0,0];
            coOrdinates[0] = dateScale(datum.date);
            coOrdinates[1] = valueScale(datum.value);
            return coOrdinates;
        });
        return pathGenerator(coOrdinatesArray);
    };
    
    svg.append('path')
        .attr('stroke',color)
        .attr('fill','none')
        .attr('d',pathMapper);
    
};