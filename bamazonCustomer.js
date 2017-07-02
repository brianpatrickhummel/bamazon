var mysql = require('mysql');
var inquirer = require('inquirer');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  lookup.displayAllProducts();
});




var lookup = {
  index: null,
  product: null,
  quantity: 0,
  displayAllProducts: function() {
    console.log("*   •   *   •   *   •   *   •   *   •   *   •   *   •");
    console.log("\n********** Welcome to the Bamazon Store **********\n");
    console.log("           (LOADING STORE INVENTORY)\n");
    setTimeout(function() {
      connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      for (var i = 0; i < res.length; i++){
        console.log("Product id: " + res[i].item_id + "\nProduct Name: " + res[i].product_name + "\nPrice: $" + res[i].price + "\n");
      }
      lookup.purchaseItem(res);
    });  
    }, 3500);
  },
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
          // console.log(index);
          lookup.product = res[lookup.index].product_name;
          // console.log(product);
          lookup.quantity = answers.numberToPurchase;
          // console.log(quantity);
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
  checkInventoryStock: function(res, product){
    if (res[lookup.index].stock_quantity === 0){
      console.log("This item is currently out of stock. We apologize for the inconvenience");
      lookup.stayOrLeave();
    }
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
      ]).then(function(answers) {
        if (answers.confirmOrder === 'Yes'){
          lookup.placeOrder(res, product);
        }
        else {
           lookup.stayOrLeave();
        }
      });
    }
    else if (res[lookup.index].stock_quantity < lookup.quantity){
      lookup.quantity = (res[lookup.index].stock_quantity);
      console.log("\nIt seems that this item is in short supply and (" + res[lookup.index].stock_quantity + ") are available for purchase");
      inquirer.prompt([
        {
          type: 'list',
          message: 'Would you like to re-order (' + lookup.quantity + ') of this item or exit the store?',
          choices: ['Yes, re-order', 'No, exit store'],
          name: 'reOrder'
        }
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
  placeOrder: function(res, product){
    var newQuantity = ((res[lookup.index].stock_quantity) - lookup.quantity);
    var productId = (lookup.index + 1);
    connection.query("UPDATE products SET ? WHERE ?",
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



