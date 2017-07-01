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
  displayAllProducts: function() {
    console.log("*   •   *   •   *   •   *   •   *   •   *   •   *   •");
    console.log("\n********** Welcome to the bAMAZON Store **********\n");
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
          var index= ((answers.itemId) - 1);
          var product = res[index].product_name;
          inquirer.prompt([
            {
              type: 'list',
              message: 'Please confirm, do you wish to purchase ' + answers.numberToPurchase + ' of this product: ' + product,
              choices: ['Yes', 'No'],
              name: 'whichOne'
            }
          ]).then(function(answers) {
            
          });
        });
      }
    });
  }
};



