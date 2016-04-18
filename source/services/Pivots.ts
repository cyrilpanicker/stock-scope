import * as moment from 'moment';
import {Candle} from '../models/Candle';

export const getPivots = (candles:Candle[]) => {
    const highs:Candle[] = [];
    const lows:Candle[] = [];
    for(let i=2;i<candles.length-1;i++){
        if(
            (candles[i-2].low > candles[i].low) &&
            (candles[i-1].low > candles[i].low) &&
            (candles[i].low <= candles[i+1].low)
        ){
            let index1 = lows.indexOf(candles[i-2]);
            let index2 = lows.indexOf(candles[i-1]);
            if(index1>-1){
                lows.splice(index1,1);
            }
            if(index2>-1){
                lows.splice(index2,1);
            }
            lows.push(candles[i]);
        }
    }
    for(let i=1;i<lows.length;i++){
        var low1 = lows[i-1];
        var low2 = lows[i];
        let candlesInBetween = candles.filter(candle => {
            return moment(candle.date).isAfter(low1.date) &&
            moment(candle.date).isSameOrBefore(low2.date);
        });
        var max = d3.max(candlesInBetween.map(candle=>candle.high));
        let high = candlesInBetween.filter(candle=>candle.high===max)[0];
        highs.push(high);
    }
    return {highs,lows};
};