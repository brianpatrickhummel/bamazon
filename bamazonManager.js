
var inquirer = require('inquirer');

function manager() {
  // Welcome screen and Menu Options
  console.log('\n* * * * * * * * * * * * * * * * * * * * * * *');
  console.log("Welcome to the Bamazon Store Management Tools\n");
  setTimeout(function() {
    managerOptions.displayMenu();
  }, 1000);
  // Main Object of Management Tools functions
  var managerOptions = {
    // function to display the main Management Tools menu
    displayMenu: function(){
      inquirer.prompt([
        {
          type: 'list',
          message: 'Please select an action from the menu below',
          choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
          name: 'menuOption'
        }
      ]).then(function(answers) {
        managerOptions.answers.menuOption();
      });
    },
    // function to view all products currently for sale in store
    "View Products for Sale": function(){
      connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (var i = 0; i < res.length; i++){
          console.log("Product id: " + res[i].item_id + "\nProduct Name: " + res[i].product_name + "\nPrice: $" + res[i].price + "\n");
        }
      });
    },
    // function to view store items with an inventory stock of less than five
    "View Low Inventory": null,
    // function to increase product inventory numbers when new stock arrives
    "Add to Inventory": null,
    // add a new product to the store inventory database
    "Add New Product": null
  };
}

module.exports = manager;