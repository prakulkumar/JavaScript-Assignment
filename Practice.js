var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var instream = fs.createReadStream('../Indicators.csv');
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);
var heading = true;
var head = [];
var manWoman = [];
var india = [];
var currentLine; // variable for data in current line
var currentLineInd;
var countMan = 0;
var countWoman = 0;
var countInd = 0;
var additionMan = 0; 
var additionWoman = 0;
var birthRate = 0;
var deathRate = 0;
var obj1 = [];
var year;
var yearAsian;
var value;
var val;
var val1;
var array3 = [];


rl.on('line',function(line){

  if(heading){
	head = line.split(",");
	heading = false;
	}
   var headIndexCountry = head.indexOf("CountryName");
   var headIndexYear = head.indexOf("Year");
   var headIndexValue = head.indexOf("Value");
//start first part
  var countries = ["AFG","ARM","AZE","BHR","BGD","BTN","BRN","KHM","CHN",
                 "CXR","CCK","IOT","GEO","HGK","IND","IDN","IRN","IRQ","ISR","JPN","JOR",
				 "KAG","KWT","KGZ","LAO","LBN","MAC","MYS","MDV","MNG","MMR","NPL","PRK",
				 "OMN","PAK","PSE","PHL","QAT","SAU","SGP","KOR","LKA","SYR","TWN","TJK",
				 "THA","TUR","TKM","ARE","UZB","VNM","YEM"];
//for(var i=0,countriesLength = countries.length; i<countriesLength; i++)

currentLine = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
countries.reduce(function(previous,current){
    var obj = {};
  if(currentLine.includes(current)){

  	  if(currentLine.indexOf("SP.DYN.LE00.MA.IN")>-1){
  	  	    year = currentLine[headIndexYear];
  	  		val = parseFloat(currentLine[headIndexValue]);
  	  		additionMan = additionMan + val;
  	  		countMan++;
  	  }
  	    
  	  if(currentLine.indexOf("SP.DYN.LE00.FE.IN")>-1){
  	  	    val1 = parseFloat(currentLine[headIndexValue]);
  	  		additionWoman =  additionWoman + val1;
  	  } 

  	  if(countMan == 52){
			var avgMan = additionMan/52;         //calculate average because there are many countries in same year
			var avgWoman = additionWoman/52;
			obj.Year = year;
			obj.Male = avgMan;
			obj.FeMale = avgWoman;

			countMan = 0;
			additionMan = 0;
			additionWoman = 0;
			manWoman.push(obj);       //here push the object into "cn" array
	  } 
  	  
  }
});





currentLine.filter(function(value,index,array){

	  if (currentLine.includes("IND")){
	  	if(value === "SP.DYN.CBRT.IN"){
		   
		   year = currentLine[headIndexYear];
		   birthRate = parseFloat(currentLine[headIndexValue]);		
		   countInd++;
	  	}
             var objInd = {}; // object creation

	  	if(value === "SP.DYN.CDRT.IN"){
		   deathRate = parseFloat(currentLine[headIndexValue]);		
			countInd++;
	  	}
	  	        
	  	if(countInd == 2){
			objInd.Year = year;
			objInd.BirthRate = birthRate;
			objInd.DeathRate = deathRate; 
			countInd = 0;

			india.push(objInd);
		}
	  }
       
       			
    });
      var object3 = {}; // object creation

	  if ((line.indexOf("SP.DYN.LE00.IN")>-1)&&(line.indexOf("2013")>-1)){
		   
		   object3.CountryName = currentLine[headIndexCountry];
		   object3.Value = currentLine[headIndexValue];
		   array3.push(object3);		
     
	  }

	  array3.sort(function(a, b){
      return b.Value - a.Value
      });
       

});



rl.on('close', function() {

var firstFile = JSON.stringify(manWoman);
 firstFile = firstFile.replace("[","[\n\t");          
 firstFile = firstFile.replace(/},/g,"},\n\t");     
 firstFile = firstFile.replace(/,/g,",\n\t");
 firstFile = firstFile.replace("]","\n\t]");

 fs.writeFile("text1.JSON",firstFile,function(err) {
   if(err){
    throw err;
   }

 });

 var SecondFile = JSON.stringify(india);
 SecondFile = SecondFile.replace("[","[\n\t");          
 SecondFile = SecondFile.replace(/},/g,"},\n\t");     
 SecondFile = SecondFile.replace(/,/g,",\n\t");
 SecondFile = SecondFile.replace("]","\n\t]");

 fs.writeFile("text2.JSON",SecondFile,function(err) {
   if(err){
    throw err;
   }

 });

 var object3=array3.splice(0,5);
 var thirdFile=JSON.stringify(object3);
 thirdFile=thirdFile.replace("[","[\n\t");
 thirdFile= thirdFile.replace(/},/g,"},\n\t");
 thirdFile= thirdFile.replace(/\\"/g,"");

 console.log(thirdFile);
 
 fs.writeFile("text3.JSON",thirdFile,function(err) {
if(err){
    throw err;
}
});

});