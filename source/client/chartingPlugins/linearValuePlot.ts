/// <reference path="../../../typings/tsd.d.ts" />
import * as d3 from 'd3';

interface LinearValuePlotData{
    ordinal:string,
    value:number
}

interface LinearValuePlotConfig{
    svg:d3.Selection<any>;
    data:LinearValuePlotData[];
    color:string;
    valueScale:d3.scale.Linear<number,number>;
    dateScale:d3.scale.Ordinal<string,number>;
}

export const plotLinearValue = (linearValuePlotConfig:LinearValuePlotConfig) => {
    
    const {svg,data,color,valueScale,dateScale} = linearValuePlotConfig;
        
    const pathGenerator = d3.svg.line().interpolate('cardinal');
    
    const pathMapper = () => {
        const coOrdinatesArray = data.map(datum => {
            const coOrdinates:[number,number]=[0,0];
            coOrdinates[0] = dateScale(datum.ordinal);
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