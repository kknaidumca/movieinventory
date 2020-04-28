const Transform = require('stream').Transform;
XLSX = require('xlsx');
var workbook = XLSX.readFile('/home/kknaidu/Documents/test.xlsx');
console.log(workbook.SheetNames[0]);
var worksheet = workbook.Sheets[workbook.SheetNames[0]];
//console.log(worksheet);
var desired_cell = worksheet["A1"];
//console.log(desired_cell);
var desired_value = (desired_cell ? desired_cell.v : undefined);
console.log(desired_value);

var stream = XLSX.stream.to_json(worksheet, {raw:true});
const items = [];
/* the following stream converts JS objects to text via JSON.stringify */
var conv = new Transform({writableObjectMode:true});
conv._transform = function(obj, e, cb)
{
	//console.log(obj.Name);
	items.push(obj);
  cb(null, JSON.stringify(obj) + "\n"); 
};
conv.end = function(cb) {
items.forEach((itms)=>{
console.log(itms.age);
});
}
stream.pipe(conv); 
//conv.pipe(process.stdout);
//console.log(conv);
