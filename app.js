const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const _= require("lodash");

const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connect("mongodb+srv://admin-pankaj:Pankaj123@cluster0.ghwm4.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true});


const itemsScheme={
    name:String
}

const Item= mongoose.model("Item",itemsScheme);

const item1=new Item({name:"Welcome to your todolist!"});  
const item2=new Item({name:"Hit the + button to add the new item."});  
const item3=new Item({name:"<-- Hit this to delete the item."});  

const defaultItems=[item1,item2,item3];
const listSchema={name:String,items:[itemsScheme]};

const List=mongoose.model("List",listSchema);



app.get("/", function(req, res){
let day = date.getDate();



    Item.find({},function(err,foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItems,function(err){
                if(err){console.log(err);}
                else{console.log("Successfull");}
            });
            res.redirect("/");
        }else{
            res.render("list",{listTitle: day,newListItems: foundItems});
        }
     });
     
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName=req.body.list;
  let day = date.getDate();

  const item = new Item({
     name:itemName
  });
  if(listName===day){
    item.save();
    res.redirect("/");
  }
  else{
      List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
      });
  }



});

app.post("/delete",function(req,res){
    
const checkedItemId=req.body.checkbox;
const listName=req.body.listName;
let day=date.getDate();
if(listName=== day){
    Item.findByIdAndRemove(checkedItemId,function(err){
        if(!err){console.log("Successfully deleted checked item");
         res.redirect("/");}
         else{console.log(err);}
     });
}
else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
        if(!err){
            res.redirect("/"+listName);
        }
    });
}





});



app.get("/:customListName",function(req,res){

    const customListName=_.capitalize(req.params.customListName);

    List.findOne({name:customListName},function(err,foundList){
       if(!err){
           if(!foundList){
               //create a new list
               const list =new List({
                name:customListName,
                items:defaultItems
                });
               list.save();
               res.redirect("/"+ customListName);
            }
           else{
               //show the existing list
               res.render('list',{listTitle:foundList.name,newListItems:foundList.items});
            }
       }

    });


   
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});