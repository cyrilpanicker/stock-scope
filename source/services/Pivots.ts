import {Candle} from '../models/Candle';

export const getPivots = (candles:Candle[]) => {
    const highs:Candle[] = [];
    const lows:Candle[] = [];
    for(let i=2;i<candles.length-1;i++){
        if(
            (candles[i-2].high < candles[i].high) &&
            (candles[i-1].high < candles[i].high) &&
            (candles[i].high >= candles[i+1].high)
        ){
            let index1 = highs.indexOf(candles[i-2]);
            let index2 = highs.indexOf(candles[i-1]);
            if(index1>-1){
                highs.splice(index1,1);
            }
            if(index2>-1){
                highs.splice(index2,1);
            }
            highs.push(candles[i]);
        }
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
    console.log(highs);
    console.log(lows);
    return {highs,lows};
};