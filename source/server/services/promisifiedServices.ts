/// <reference path="../../../typings/tsd.d.ts" />
import {readFile} from 'fs';

export const readFileAsync = (file:string) => {
    return new Promise((resolve,reject) => {
        readFile(file,(error,data) => {
            if(error){
                reject(error);
            } else {
                resolve(data.toString());
            }
        });
    });
};