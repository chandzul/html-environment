"use strict";

// esta funcion solo es un test
function first_test() {
	return "This is a test|";
};

// Esta funcion es otro test en main
var firstTest = first_test();

if (firstTest == undefined) {
	var second_test = function(){
		return firstTest;
	};
};

// ultima funcion
var square = function(x){
	return x * x;
};