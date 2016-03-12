export interface Candle{
    date:string;
    symbol:string;
    open:number;
    high:number;
    low:number;
    close:number;
    volume:number;
    turnover?:number;
}