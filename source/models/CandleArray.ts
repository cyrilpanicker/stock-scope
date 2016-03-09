import {Candle} from './Candle';
import {addSMA} from '../indicators/SMA';

export class CandleArray{
    private data:Candle[];
    constructor(data:Candle[]){
        this.data = data;
    }
    getCandles(){
        return this.data;
    }
    addSMA(period:number,property:string='close'){
        addSMA({
            data:this.data,
            property,
            period
        });
        return this;
    }
}