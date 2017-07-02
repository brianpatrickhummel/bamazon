var mysql = require('mysql');
var inquirer = require('inquirer');
var manager = require('./bamazonManager.js');
var db = require('./mysqlConnection.js');   // shared mysql connection data file

// main object containing functions and variables for various store features
var lookup = {
  index: null,
  product: null,
  quantity: 0,
  // function to display current inventory of store
  displayAllProducts: function() {
    console.log("*   •   *   •   *   •   *   •   *   •   *   •   *   •");
    console.log("\n********** Welcome to the Bamazon Store **********\n");
    console.log("           (LOADING STORE INVENTORY)\n");
    setTimeout(function() {
      db.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      for (var i = 0; i < res.length; i++){
        console.log("Product id: " + res[i].item_id + "\nProduct Name: " + res[i].product_name + "\nPrice: $" + res[i].price + "\n");
      }
      lookup.purchaseItem(res);
    });  
    }, 3500);
  },
  // function to gather purchase data prior to the checkout process
  purchaseItem: function(res){
    inquirer.prompt([
      {
        type: 'list',
        message: 'Would you like to purchase an item from the Bamazon Store inventory listed above?',
        choices: ['Yes', 'No'],
        name: 'whichOne'
      }
    ]).then(function(answers) {
      if (answers.whichOne === 'Yes'){
        inquirer.prompt([
          {
            type: 'input',
            message: 'Please enter the id number of the item',
            name: 'itemId'
          },
          {
            type: 'input',
            message: 'How many do you wish to purchase?',
            name: 'numberToPurchase'
          }
        ]).then(function(answers) {
          lookup.index = ((answers.itemId) - 1);
          lookup.product = res[lookup.index].product_name;
          lookup.quantity = answers.numberToPurchase;
          inquirer.prompt([
            {
              type: 'list',
              message: '\nPlease confirm, do you wish to purchase (' + answers.numberToPurchase + ') of this product:\n' + lookup.product,
              choices: ['Yes', 'No'],
              name: 'whichOne'
            }
          ]).then(function(answers) {
            if (answers.whichone === 'No'){
              lookup.stayOrLeave();
            }
            else {
              lookup.checkInventoryStock(res, lookup.product);
            }
          });
        });
      }
    });
  },
  // function to check inventory stock of requested item
  checkInventoryStock: function(res, product){
    // item out of stock
    if (res[lookup.index].stock_quantity === 0){
      console.log("This item is currently out of stock. We apologize for the inconvenience");
      lookup.stayOrLeave();
    }
    // item is sufficiently stock to complete order
    else if (res[lookup.index].stock_quantity > lookup.quantity){
      console.log("\n* * * * * * * * * ** * * * * * * * * * * * * * * * * * * * * * *\n")
      var totalCost = ((lookup.quantity) * (res[lookup.index].price)).toFixed(2);
      inquirer.prompt([
        {
          type: 'list',
          message: "The total for your order of (" + lookup.quantity + ") " + lookup.product + " is $" + totalCost + "\nDo you confirm the accuracy of this order and wish to proceed with this purchase?",
          choices: ['Yes', 'No'],
          name: 'confirmOrder'
        }
      // final order confirmation prompt 
      ]).then(function(answers) {
        if (answers.confirmOrder === 'Yes'){
          lookup.placeOrder(res, product);
        }
        else {
          lookup.stayOrLeave();
        }
      });
    }
    // item is in stock but stock is not sufficient for the quantity ordered
    else if (res[lookup.index].stock_quantity < lookup.quantity){
      lookup.quantity = (res[lookup.index].stock_quantity);
      console.log("\nIt seems that this item is in short supply and (" + res[lookup.index].stock_quantity + ") are available for purchase");
      // option to re-order a lesser quantity
      inquirer.prompt([
        {
          type: 'list',
          message: 'Would you like to re-order (' + lookup.quantity + ') of this item or exit the store?',
          choices: ['Yes, re-order', 'No, exit store'],
          name: 'reOrder'
        }
      // final order confirmation prompt for adjusted quantity order
      ]).then(function(answers) {
        if (answers.reOrder === 'Yes, re-order'){
          lookup.placeOrder();
        } 
        else {
          console.log("Farewell!");
          process.exit(0);
        }
      });
    }
  },
  //function to place order (checkout) and update inventory
  placeOrder: function(res, product){
    var newQuantity = ((res[lookup.index].stock_quantity) - lookup.quantity);
    var productId = (lookup.index + 1);
    db.query("UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: newQuantity
        },
        {
          item_id: productId
        }
      ],
      function(err, res) {
        console.log("\n* * * * * * * * * ** * * * * * * * * * * * * * * * * * * * * * *\n")
        console.log("\nThank you for your order!")
        console.log("\nInventory updated")
      }
    );
  },
  //function which negotiates situations where options are starting order process over or exiting 
  stayOrLeave: function(){
    inquirer.prompt([
      {
        type: 'list',
        message: '\nWhat would you like to do?',
        choices: ['View Bamazon product list again', 'Exit'],
        name: 'stayOrLeave'
      }
    ]).then(function(answers) {
      if (answers.stayOrLeave === 'View Bamazon product list again'){
        look.displayAllProducts();
      }
      else {
        console.log("Farewell!");
        process.exit(0);
      }
    });
  }
};

// Initialization of Main Application from NODE.js CLI
// either the Management Tools app or Consumer Purchase app launces
if (process.argv[2] === 'manager'){
    manager();
  }
else lookup.displayAllProducts();

