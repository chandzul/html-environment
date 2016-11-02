var start = require('./start');
var unique = require('uniq');

// Usando el paquete de npm
var data = [1, 2, 2, 3, 4, 5, 5, 5, 6];
console.log(unique(data));

// Usando nuestro archivo local
var y = start.b(3);
console.log('N: ' + y);