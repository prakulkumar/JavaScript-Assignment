var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var instream = fs.createReadStream('../Indicators.csv');
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);
var heading=true;
var head=[];
var manWoman=[];
var india=[];
var currentLine; // variable for data in current line
var currentLineInd;
var countMan = 0;
var countWoman = 0;
var countInd = 0;
var additionMan = 0; 
var additionWoman = 0;
var addBirthRate = 0;
var addDeathRate = 0;



rl.on('line',function(line){

  if(heading){
	head=line.split(",");
	heading=false;
	}
   
//start first part

var countries = ["AFG","ARM","AZE","BHR","BGD","BTN","BRN","KHM","CHN",
                 "CXR","CCK","IOT","GEO","HGK","IND","IDN","IRN","IRQ","ISR","JPN","JOR",
				 "KAG","KWT","KGZ","LAO","LBN","MAC","MYS","MDV","MNG","MMR","NPL","PRK",
				 "OMN","PAK","PSE","PHL","QAT","SAU","SGP","KOR","LKA","SYR","TWN","TJK",
				 "THA","TUR","TKM","ARE","UZB","VNM","YEM"];
//var countriesLength = countries.length;

//for(var i=0,countriesLength = countries.length; i<countriesLength; i++)
var i = 0;
countries.forEach(function(){

	if(line.indexOf(countries[i])>-1) {
		if((line.indexOf("SP.DYN.LE00.MA.IN")>-1)||(line.indexOf("SP.DYN.LE00.FE.IN")>-1)){
			var obj = {}; // object creation
			currentLine = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);    // split the current line
			
			//for(var j=0;j<head.length;j++)
			var j = 0;
			head.forEach(function()
			{
				if(head[j]=="Year"||head[j]=="Value"){

					if(head[j]=="Year"){
						year = currentLine[j]; // year is assigned here
					}// nested year if

					if(head[j]=="Value"){
						if(line.indexOf("SP.DYN.LE00.MA.IN")>-1){
							val=parseFloat(currentLine[j]);  //conversion of string in float
							additionMan = additionMan + val;       //if more values make them add togethers
							countMan++;
						}// if it is man values

						else{
							val=parseFloat(currentLine[j]);
							additionWoman =  additionWoman + val;
							countWoman++;
						}// if it is woman values

						if(countMan==52){
			               var avgMan=additionMan/52;         //calculate average because there are many countries in same year
			               var avgWoman=additionWoman/52;
			                obj.Year=year;
			                obj.Male = avgMan;
			                obj.FeMale= avgWoman;

			                 countMan=0;
			                 additionMan=0;
			                 additionWoman=0;
			                 manWoman.push(obj);       //here push the object into "cn" array
			              }

						}// nested value if

					} // if in inner for loop
					j++;
				});// inner forEach loop
			}// end of secound if

		} // end of first if
	    i++;
	});  //end of forEach

    //end first part 

    
    // start second part

	if(line.indexOf("IND")>-1){
		if((line.indexOf("SP.DYN.CBRT.IN")>-1)||(line.indexOf("SP.DYN.CDRT.IN")>-1)){
			var objInd = {}; // object creation
			currentLineInd = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
			for(var k=0;k<head.length;k++){
				if(head[k] == "Year"||head[k] == "Value"){
					if(head[k] == "Year"){
						var yearInd = currentLineInd[k];
					} // year end

					if(head[k] == "Value"){
						if(line.indexOf("SP.DYN.CBRT.IN")>-1){
							var birthRate = parseFloat(currentLineInd[k]);
							addBirthRate = addBirthRate + birthRate;
							countInd++;
						}  // for birthRate

						else{
							var deathRate = parseFloat(currentLineInd[k]);
							addDeathRate = addDeathRate + deathRate;
							countInd++;
						} // for deathRate
					}   // value end
				} // head checking end 

				if(countInd == 2){
					objInd.Year = yearInd;
					objInd.BirthRate = addBirthRate;
					objInd.DeathRate = addDeathRate;
					addBirthRate = 0;
					addDeathRate = 0;
					countInd = 0;

					india.push(objInd);
				}

			}
		}

	}// for india only
    
    // end second Part

   // start third Part
   /*var totalCountries = [];
   var yearTotal;
   var valueTotal;
   var currentLineTotal;
   var array1 = [];

   if((line.indexOf("SP.DYN.LE00.IN")>-1)&&(line.indexOf("1960")>-1)){
        var objTotal = {}; // object creation
        var countryName;
		currentLineTotal = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
		for(var x=0;x<head.length;x++){
			if(head[x] == "CountryName"){

			}
		}


   } //end if*/




}); // end of rl

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


 var secondFile = JSON.stringify(india);
 secondFile = secondFile.replace("[","[\n\t");          
 secondFile = secondFile.replace(/},/g,"},\n\t");     
 secondFile = secondFile.replace(/,/g,",\n\t");
 secondFile = secondFile.replace("]","\n\t]");

 fs.writeFile("text2.JSON",secondFile,function(err) {
   if(err){
    throw err;
   }

 });

});