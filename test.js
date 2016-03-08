// var input = [1, 10, 40, 100];

var average = function(inputArray){
	var total = inputArray.reduce(function(last,current,currentIndex){
		return (last*(currentIndex) + current)/(currentIndex+1);
	});
	return total;
};

previousData = [
	{close:1},
	{close:10},
];

var inputArray = [
	{close:40},
	{close:100},
	{close:60},
	{close:70},
	{close:80},
	{close:90},
	{close:100}
];

var addMovingAverage = function(data,previousData,property,period){
	var combinedData = previousData.concat(data);
	for (var i = 0; i < combinedData.length; i++) {
		if (i >= period-1) {
			combinedData[i]['ma'+period] = average(
				combinedData
					.slice(i+1-period,i+1)
					.map(function(datum){return datum[property]})
			);
		}
	};
}

addMovingAverage(inputArray,previousData,'close',3);

console.log(inputArray);

/*
1 - 1
10 - 5.5
40 - 17
100 - 37.75
*/

//3, 5, 8, 13, 21, 34, 55, 89