/// <reference path="../../../typings/tsd.d.ts" />

let _stocksList:any[];

export const setStocksList = (stocksList) => {
    _stocksList = stocksList;
};

export const getAllIndustries = () => {
    const industries = []; 
    _stocksList.forEach(stock => {
        if(industries.indexOf(stock.industry) === -1){
            industries.push(stock.industry);
        }
    });
    return industries;
};