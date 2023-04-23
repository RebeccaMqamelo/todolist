//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// SET UP DB

//const items = ["Buy Food", "Cook Food", "Eat Food"];
//const workItems = [];

mongoose.connect("mongodb+srv://rebeccamqamelo:0712177489@cluster0.i4bvkyp.mongodb.net/todolistDB", {useNewUrlParser: true})

const itemsSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please add an item to the list!"]
  }
});

const Item = mongoose.model("Item", itemsSchema); // capitalise mongoose models!

const item1 = new Item({
  name: "Buy food"
})

const item2 = new Item({
  name: "Cook food"
})

const item3 = new Item({
  name: "Eat food"
})

const defaultItems = [item1, item2, item3];



// -------------------------------

const listSchema = {
  name: {type: String, require: [true, "Please add a valid list name"]},
  items: [itemsSchema]
};

const List = mongoose.model("Lists", listSchema);


app.get("/", function(req, res) {

  const day = date.getDate();

  Item.find({}).then(foundItems => {
    console.log(foundItems);
    if (foundItems.length === 0) { // insert default items
      Item.insertMany(defaultItems);
      res.redirect("/") // and return to root route to call the else statement below:
    } else { // render existing items
      res.render("list", { listTitle: day, newListItems: foundItems });
    }
    
  });

    //res.render("list", {listTitle: day, newListItems: items});

});

// ----------------------------

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
  
  const item = new Item ({
    name: itemName
  });

  if (listName === date.getDate()) {
    item.save(); //saves into collection
    res.redirect("/");
  } else { // new item comes from a custom list
    List.findOne({name: listName}).then(foundList => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === date.getDate()) {
    Item.findByIdAndRemove(checkedItemId).then(console.log("Successfully removed"));
    console.log("Successfully deleted!")
    res.redirect("/");
  } else { // new item comes from a custom list
    List.findOneAndUpdate({ name: listName }, 

      
      {$pull: {items: {_id: checkedItemId}}}).then(
        foundList => {
          foundList.save();
          res.redirect("/" + listName)})
    }
});

// When use tries to create a new list, create a new list in the Lists collection

app.get("/:customListName", function(req,res){
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({
    name: customListName
  }).then(foundList => {
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirect("/" + customListName); // current route, not root route!
    } else {
      res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
    }
  } 
  )
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
