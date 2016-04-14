import {Candle} from './Candle';
import {getSMA} from '../services/SMA';
import {getPivots} from '../services/Pivots';

export class CandleList{
    private data:Candle[];
    constructor(data:Candle[]){
        this.data = data;
    }
    toArray(){
        return this.data;
    }
    getSMA(period:number,valueProperty:string='close'){
        return getSMA(this.data,valueProperty,period);
    }
    getPivots(){
        return getPivots(this.data);
    }
}