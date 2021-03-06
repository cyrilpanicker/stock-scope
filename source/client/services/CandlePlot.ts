/// <reference path="../../../typings/tsd.d.ts" />
import * as d3 from 'd3';
import {Candle} from '../../models/Candle';

interface CandlePlotConfig{
    element:d3.Selection<any>;
    candles:Candle[];
    valueScale:d3.scale.Linear<number,number>;
    dateScale:d3.scale.Ordinal<string,number>;
    candleWidth:number
}

export const plotCandles = ({element,candles,valueScale,dateScale,candleWidth}:CandlePlotConfig) => {
    
    const candleStems = element.selectAll('line.candle-stem').data(candles);
    candleStems.exit().remove();
    candleStems.enter().append('line').attr('class','candle-stem');
    candleStems
        .attr('x1',candle => dateScale(candle.date))
        .attr('y1',candle => valueScale(candle.high))
        .attr('x2',candle => dateScale(candle.date))
        .attr('y2',candle => valueScale(candle.low))
        .attr('stroke','black');
        
    const candleBodies = element.selectAll('rect.candle-body').data(candles);
    candleBodies.exit().remove();
    candleBodies.enter().append('rect').attr('class','candle-body');
    candleBodies
        .attr('x',candle => dateScale(candle.date) - 0.5 * candleWidth)
        .attr('y',candle => valueScale(d3.max([candle.open,candle.close])))
        .attr('width',_ => candleWidth)
        .attr('height',candle => ((valueScale(d3.min([candle.open,candle.close])) - valueScale(d3.max([candle.open,candle.close]))) || 0.01))
        .attr('stroke','black')
        .attr('fill',candle => candle.open > candle.close ? 'black' : 'white');
    
};