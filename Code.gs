  
var ss = SpreadsheetApp.getActiveSpreadsheet()
var sheet = ss.getSheets()[0];
var fileName = sheet.getRange(16,1).getValue();
var iter = DriveApp.getFilesByName(fileName);
  var file = iter.next();
  var jsonFile = file.getAs('application/json');
  //var aneesh = JSON.parse(JSON.stringify(jsonFile));
  var aneesh = JSON.parse(jsonFile.getDataAsString());
var question = "";
const endEvent = aneesh.process.endEvent.id;
//var ui = SpreadsheetApp.getUi();
//var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1yuyANg7IHN_hghu84q5tcx1QCSZN-h1c0qvaQixJOKM/edit");
//var sheet = ss.getSheets()[0];
var aneeka="";
var ticker = 0;

function doGet(e){

  if (e.parameters.v == "compute"){
var daniel = sheet.getRange(7,2).getDisplayValue();
return HtmlService.createTemplate("<H1>"+daniel+"</H1><button onClick=\"window.history.back()\">Back</button>").evaluate();
  }
  else{
    sheet.getRange(7,1,7,2).clearContent();
var tmp = HtmlService.createTemplateFromFile("page");
    for (i=1;i<=sheet.getLastRow();i++){
      if (sheet.getRange(i,1).isBlank()){
       var endPoint = i
        break;
      }
    }
//tmp.question = sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn()).getValues();
    tmp.question = sheet.getRange(1,1,endPoint-1,sheet.getLastColumn()).getValues();

 // tmp.question = [["1e","1e"],[["2e","2e"],["3e","3e"]];
 // for (i=0;i<sheet.getLastRow()-1;i++){
// tmp.question = [["1hi", "1My", "1d"],["2hi", "2My", "2d"]];
 // }
  tmp.cols = sheet.getLastColumn();
  return tmp.evaluate();
  }
}

function testMe(){
  while (sheet.getRange(7,2).getValue().length < 1){
Logger.log("empty");
  }
       Logger.log("full");    
}

function myFunction(userAnswer){   
  var nextEvent = aneesh.process.startEvent.outgoing; 
  var thisEvent;
 return myFlow(nextEvent, userAnswer);
}

function myFlow(nextEvent, userAnswer){
   // sheet.getRange(8,1+ticker).setValue(nextEvent);
  ticker = ticker + 1;
   for (x in aneesh.process.sequenceFlow){
    //find what the target of the flow is
    if (nextEvent == aneesh.process.sequenceFlow[x].id) {
      //Logger.log(JSON.stringify(aneesh.process.sequenceFlow[x].targetRef));
      nextEvent = aneesh.process.sequenceFlow[x].targetRef;
     // Logger.log(nextEvent);
     return whichEvent(nextEvent, userAnswer);
    }
    }
  
}

function whichEvent(nextEvent, userAnswer){
  Logger.log(nextEvent);
    stringEvent=JSON.stringify(nextEvent);

        if (stringEvent.includes("Gateway")){
       return myGateway(nextEvent, userAnswer);
      }
      
      if(stringEvent.includes("Activity")){
      return myActivity(nextEvent, userAnswer);
      }
      
      if(stringEvent.includes("Flow")){
      return myFlow(nextEvent, userAnswer);
      }
      
      if(nextEvent == endEvent){
       // sheet.getRange(10,1).setValue("yes");
        return endingEvent();
      }
}

function myGateway(nextEvent, userAnswer){
 // sheet.getRange(7,2).setValue(userAnswer[0]+userAnswer[1]+userAnswer[2]);
var answers = [];
  var answerTicker = 0;
  for (y in aneesh.process.exclusiveGateway){
    //if there is only one gateway
    if (isNaN(y)==true){    
     // Logger.log(aneesh.process.exclusiveGateway.name);
      //find the questions for that gateway
      for (x in aneesh.process.sequenceFlow){
        if (aneesh.process.sequenceFlow[x].sourceRef == nextEvent){
         answers [answers.length] = aneesh.process.sequenceFlow[x].name;
        }          
      }
     // Logger.log(question);
      thisEvent = aneesh.process.exclusiveGateway.outgoing;
      question = aneesh.process.exclusiveGateway.name; 
      
      //Dialog box      
var response = ui.alert(JSON.stringify(question), ui.ButtonSet.YES_NO);
      if (response == ui.Button.YES) {
myFlow(thisEvent[0])
      } 
      else {
myFlow(thisEvent[1]);
      }
     // myFlow(thisEvent[0]);
     // myFlow(thisEvent[1]);
      break;

    }

    else{
         
    //if there is more than one gateway else statement
     if (nextEvent == (aneesh.process.exclusiveGateway[y].id)) {
      //Logger.log(JSON.stringify(aneesh.process.sequenceFlow[x].targetRef));
       for (x in aneesh.process.sequenceFlow){
        if (aneesh.process.sequenceFlow[x].sourceRef == nextEvent){
          answerTicker++;
         answers [answers.length] = aneesh.process.sequenceFlow[x].name;
         sheet.getRange(1+Number(y),2+Number(answerTicker)).setValue(answers[answerTicker-1]); 
        }          
      }

      thisEvent = (aneesh.process.exclusiveGateway[y].outgoing);
       
      question = aneesh.process.exclusiveGateway[y].name;
       sheet.getRange(1+Number(y),2).setValue(nextEvent);
      sheet.getRange(1+Number(y),1).setValue(question);
    
       //Dialog box      
      if (userAnswer[y].toString()=="Not done"){
        return endingEvent();
       }
       
       else{
var findQuestion = sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn()).createTextFinder(nextEvent).matchEntireCell(true).findNext();
var findAnswer = sheet.getRange(findQuestion.getRow(),1,findQuestion.getRow(),10).createTextFinder(userAnswer[y].toString()).matchEntireCell(true).findNext();
      // sheet.getRange(9,1+ticker).setValue(nextEvent);
      //  sheet.getRange(10,1+ticker).setValue(userAnswer[y].toString());
return myFlow(thisEvent[findAnswer.getColumn()-3], userAnswer);
       }
     // myFlow(thisEvent[0]);
     // myFlow(thisEvent[1]);
      break;

    
     }
    }
    

    
  }
}


function myActivity(nextEvent, userAnswer){
  for (x in aneesh.process.task){
    if (nextEvent == (aneesh.process.task[x].id)) {
            aneeka += JSON.stringify((aneesh.process.task[x].name)) + "........";
     // sheet.getRange(7,2).setValue(aneeka);
      //Logger.log(JSON.stringify((aneesh.process.task[x].name)));
      //var CDScard = HtmlService.createHtmlOutput("<h1>"+JSON.stringify((aneesh.process.task[x].name))+"</h1>");
      //ui.alert(JSON.stringify((aneesh.process.task[x].name)));
      nextEvent = (aneesh.process.task[x].outgoing);
      //go to Gateway function 
     return myFlow(nextEvent, userAnswer);
    }
  }
}

function testAneeka(){
}

function doPost(e){
//  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1yuyANg7IHN_hghu84q5tcx1QCSZN-h1c0qvaQixJOKM/edit");
//var sheet = ss.getSheets()[0];
  var ss = SpreadsheetApp.getActiveSpreadsheet()
var sheet = ss.getSheets()[0];
const body = e.postData.contents;
const bodyJSON = JSON.parse(body);
  var answer2d=[];
  for (i in bodyJSON){
    answer2d.push([i, bodyJSON [i]]);
  }
  var answer =[];
  for (i in answer2d){
    answer[i] = answer2d[i][1];
  }
 
 // bodyString = JSON.stringify(bodyJSON)
//sheet.getRange(10,1).setValue(String(answer[2]));
  return myFunction(answer);
}

function endingEvent(){
  if (aneeka==""){
    aneeka = "Not enough information";
  }
 // sheet.getRange(11,1).setValue(aneeka);
 // sheet.getRange(12,1).setValue(aneeka);
  const JSONaneeka = [{status: aneeka}];
  return ContentService.createTextOutput(JSON.stringify(JSONaneeka)).setMimeType(ContentService.MimeType.JSON);
  
//return ContentService.createTextOutput(JSONaneeka).setMimeType(ContentService.MimeType.JSON);
}

function createDocumentation(){
var RESTAPIlink = sheet.getRange(20,1).getValue()+"&answer={"
 for (i=1;i<=sheet.getLastRow();i++){
      if (sheet.getRange(i,1).isBlank()){
       var endPoint = i
        break;
      }
    }

for (i=0;i<=endPoint-2;i++){
RESTAPIlink = RESTAPIlink+"\""+String(i)+"\":\""+sheet.getRange(i+1,3).getValue()+"\","
}
RESTAPIlink = RESTAPIlink.slice(0,RESTAPIlink.length-1);
RESTAPIlink = RESTAPIlink+"}";
sheet.getRange(22,1).setValue(RESTAPIlink);
}

function testDialog(){                                                     //for show the msg to the user
  var template = HtmlService.createTemplateFromFile("popmsg").evaluate();   //file html
  SpreadsheetApp.getUi().showModalDialog(template,"File Upload");           //Show to user, add title
}

function uploadFilesToGoogleDrive(data,name,type){                          //function to call on front side
  //var datafile = Utilities.base64Decode(data)                               //decode data from Base64
  //var blob2 = Utilities.newBlob(datafile, type, name);                      //create a new blob with decode data, name, type
  var folder = DriveApp.getFoldersByName("BPMN"); //Get folder of destiny for file (final user need access before execution)
  var newFile = folder.next().createFile(name,data);                                   //Create new file (property of final user)
  sheet.getRange(16,2).setValue(name);
   var rowData = [                                                          //for print results
    newFile.getName(),
    newFile.getId(),
    newFile.getUrl(),
    newFile.getSize(),
    newFile.getDateCreated()
  ];
 // SpreadsheetApp.getActive().getSheetByName("data").appendRow(rowData);     //print results
  
  return newFile.getUrl()                                                   //Return URL
}
