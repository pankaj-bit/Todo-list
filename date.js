
module.exports.getDate=getDate;

function getDate(){
let today= new Date();
    let currentDay=today.getDay();
    let day="";

let options={
    weekday: "long",
    day: "numeric",
    month: "long"
};
 return today.toLocaleDateString("en-US",options);
} 


module.exports.getDay=getDay;


function getDay(){

const today=new Date();
const options={
    weekday:"long"
};

return today.toLocaleDateString("en-US",options);

}