
var inquirer = require('inquirer');
var mysql = require('mysql');
var db = require('./mysqlConnection.js');

function manager() {
  // Welcome screen and Menu Options
  console.log('\n* * * * * * * * * * * * * * * * * * * * * * *');
  console.log("Welcome to the Bamazon Store Management Tools\n");
  setTimeout(function() {
    managerOptions.displayMenu();
  }, 550);
  
  // Main Object of Management Tools functions
  var managerOptions = {
    productList: [],
    index: null,
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
        managerOptions[answers.menuOption]();
      });
    },
    // function to view all products currently for sale in store
    "View Products for Sale": function(boolean){
      db.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        managerOptions.productList = res;
        // Log all results of the SELECT statement
        for (var i = 0; i < res.length; i++){
          console.log("Product id: " + res[i].item_id + "\nProduct Name: " + res[i].product_name + "\nPrice: $" + res[i].price + "\nCurrent Stock: (" + res[i].stock_quantity + ")\n");
        }
        if (!boolean) {process.exit(0);}
      });
    },
    // function to view store items with an inventory stock of less than five
    "View Low Inventory": function() {
      db.query("SELECT * FROM products WHERE stock_quantity<5", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (var i = 0; i < res.length; i++){
          console.log("");
          console.log("\nProduct id: " + res[i].item_id + "\nProduct Name: " + res[i].product_name + "\nCurrent Stock: (" + res[i].stock_quantity + ")\n");
        }
        process.exit(0);
      });
    },
    // function to increase product inventory numbers when new stock arrives
    "Add to Inventory": function(productList) {
      // display current product list
      managerOptions['View Products for Sale'](true);   //boolean will override the node exit configured at end of the "View Products for Sale" function
      var whichProduct = null;
      setTimeout(function() {
        inquirer.prompt([
          {
            type: 'input',
            message: '\nEnter a product id number for inventory stock adjustment',
            name: 'whichProduct',
            validate: function(value) {
              if (isNaN(value) === false && value <= managerOptions.productList.length) {
                return true;
              }
              else return false;
            }
          }
        ]).then(function(answers) {
          managerOptions.index = (answers.whichProduct -1);
          inquirer.prompt([
            {
              type: 'list',
              message: '\nYou have entered the product id of the item: ' + managerOptions.productList[managerOptions.index].product_name + ')\nIf this is correct choose YES, otherwise choose NO to re-type correct product id',
              choices: ['YES', 'NO'],
              name: 'confirm'
            }
          ]).then(function(answers) {
            if (answers.confirm === 'NO') {
              managerOptions['Add to Inventory']();
            }
            else {
              inquirer.prompt([
                {
                  type: 'input',
                  message: '\nHow many units do you wish to add to this product id\'s inventory?',
                  name: 'howMany',
                  validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    else return false;
                  }
                }
              ]).then(function(answers) {
                var inventoryChange = parseInt(answers.howMany);
                inquirer.prompt([
                  {
                    type: "list",
                    message: "Confirm, add (" + answers.howMany + ") units to product id (" + whichProduct + ")" ,
                    name: "confirm",
                    choices: ['Yes', 'No'],
                  }
                ]).then(function(answers) {
                  var newQuantity = (parseInt(managerOptions.productList[whichProduct - 1].stock_quantity) + inventoryChange);
                  console.log(newQuantity);
                  if (answers.confirm === 'Yes') {
                    db.query(
                      "UPDATE products SET ? WHERE ?",
                      [
                        {
                          stock_quantity: newQuantity
                        },
                        {
                          item_id: whichProduct
                        }
                      ],
                      function(err, res) {
                        console.log("\nProduct inventory successfully updated!\n");
                        inquirer.prompt([
                          {
                            type: 'list',
                            message: 'Modify inventory for additional products?',
                            choices: ['Yes', 'No'],
                            name: 'whichOne'
                          }
                        ]).then(function(answers) {
                          if (answers.whichOne === 'Yes'){
                            managerOptions["Add to Inventory"]();
                          }
                          else process.exit(0);
                        });
                      }
                    );
                  }
                  else {console.log("Goodbye"); process.exit(0);}
                });
              });
            }
          });
        });
      }, 600);
    },
    // add a new product to the store inventory database
    "Add New Product": function() {
      inquirer.prompt([
        {
          type: 'input',
          message: '\nEnter the product name: ',
          name: 'productName'
        },
        {
          type: 'input',
          message: 'Enter the department that will house this product: ',
          name: 'deptName'
        },
        {
          type: 'input',
          message: 'Enter the purchase price in USD (enter only dollars/cents, no currency symbol): ',
          name: 'price',
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          type: 'input',
          message: 'Enter the number of units that will be added to inventory stock: ',
          name: 'stock',
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ]).then(function(answers) {
        db.query(
          "INSERT INTO products SET ?",
          {
            product_name: answers.productName,
            department_name: answers.deptName,
            price: answers.price, 
            stock_quantity: answers.stock
          },function(err, res) {
            console.log("\nProduct has been added to inventory.");
            inquirer.prompt([
              {
                type: 'list',
                message: '\nAdd additional new products to inventory?',
                choices: ['Yes', 'No'],
                name: 'whichOne'
              }
            ]).then(function(answers) {
              if (answers.whichOne === "Yes") {
                managerOptions["Add New Product"]();
              }
              else {console.log('\nGoodbye'); process.exit(0);}
            });
          }
        );
      });
    }
  };
}

module.exports = manager;