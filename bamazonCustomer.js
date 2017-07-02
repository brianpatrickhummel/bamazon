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
          index = ((answers.itemId) - 1);
          // console.log(index);
          product = res[index].product_name;
          // console.log(product);
          lookup.quantity = answers.numberToPurchase;
          // console.log(quantity);
          inquirer.prompt([
            {
              type: 'list',
              message: 'Please confirm, do you wish to purchase (' + answers.numberToPurchase + ') of this product:\n' + product,
              choices: ['Yes', 'No'],
              name: 'whichOne'
            }
          ]).then(function(answers) {
            if (answers.whichone === 'No'){
              inquirer.prompt([
                {
                  type: 'list',
                  message: 'What would you like to do?',
                  choices: ['View Bamazon product list again', 'Exit'],
                  name: 'buyOrLeave'
                }
              ]).then(function(answers) {
                if (answers.buyOrLeave === 'View Bamazon product list again'){
                  look.displayAllProducts();
                }
                else {
                  console.log("Farewell!");
                  return false;
                }
              });
            }
            else {
              lookup.checkInventoryStock(res, product);
            }
          });
        });
      }
    });
  },
  checkInventoryStock: function(res, product){
    if (res[index].stock_quantity > lookup.quantity){
      console.log("\n* * * * * * * * * ** * * * * * * * * * * * * * * * * * * * * * *\n")
      var totalCost = ((lookup.quantity) * (res[index].price));
      inquirer.prompt([
        {
          type: 'list',
          message: "The total for your order of (" + lookup.quantity + ") " + product + " is $" + totalCost + "\n\nDo you confirm the accuracy of this order and wish to proceed with this purchase?",
          choices: ['Yes', 'No'],
          name: 'confirmOrder'
        }
      ]).then(function(answers) {
        if (answers.confirmOrder === 'Yes'){
          lookup.placeOrder();
        }
        else {

        }
      });
    }
  },
  placeOrder: function(){

  }
};

// res[index].product_name;

