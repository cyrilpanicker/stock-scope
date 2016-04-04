/// <reference path="../../../typings/tsd.d.ts" />
import * as d3 from 'd3';

export interface CurvePlotData{
    date:string,
    value:number
}

export interface CurvePlotConfig{
    element:d3.Selection<any>;
    data:CurvePlotData[];
    color:string;
    valueScale:d3.scale.Linear<number,number>;
    dateScale:d3.scale.Ordinal<string,number>;
}

export const plotCurve = ({element,data,color,valueScale,dateScale}:CurvePlotConfig) => {
        
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
    
    element.append('path')
        .attr('stroke',color)
        .attr('fill','none')
        .attr('d',pathMapper);
    
};