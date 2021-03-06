# Bamazon Store Node.js/mySQL Application

Amazon-like Node.js CLI app paired with a MySQL Database. Interface built with the Inquirer NPM library, which allows customers to purchase products as well as permits management to manage store inventory.

### Video Demo
This application runs in the Node Command Line Interface and is, therefore, not deployed for viewing.   A demo of the CLI operation of the app can be viewed by clicking [here](https://youtu.be/Jo7HjSom2YE)


## Instructions
The Bamazon store includes two application modes: Consumer Store and Management Tools.



### Consumer Store
To enter the **Consumer Store**, from the CLI type: *node bamazonCustomer.js*

* After loading the Consumer Store, a list of all the currently stocked products will be listed on the screen. 

* A prompt will then display, asking if the purchase of an item is necessary. If so, a prompt will then request the **product id number** of the item to be purchased. The user will enter a **product id number**

* A prompt will then for a **quantity** of the selected item to be purchased. The user will enter a **number**.

* A confirmation prompt will appear, asking the user to confirm that the information gathered thus far is correct,  displaying the product name and the quantity to be purchased. The user will confirm.

* The application will then query the Store Database and check the requested quantity of the selected item against the current inventory.  
  * If the quantity ordered exceeds current stock, the user will be prompted and asked if they wish to purchase the amount of stock that is currently available.
  * If, for some reason, the item is out of stock, the user is informed that the item is no longer available and is prompted to either remain in the store or to exit.

* This is followed by a final order confirmation prompt, displaying the product name, number of items to be purchased and the total price.  If confirmed by customer, the order is placed and the inventory record





### Management Tools
To enter the **Management Tools**, from the CLI type: *node bamazonCustomer.js manager*

Within the Management Tools application, a menu present the following four available options:

**1. View Products for Sale**

* A complete list of current inventory is displayed including *Product id*, *Product Name*, *Price* and *Quantity in Stock*

**2. View Low Inventory**

* A list is returned displaying all products in the store with a current Inventory Stock of less than 5 items.

**3. Add to Inventory**

* A complete list of current inventory is displayed

* A prompt requests the **product id number** to target for inventory adjustment. Manager enters the **product id number**.

* A prompt asks to confirm the product name to be adjusted.  Manager will confirm.

* A prompt requests the **quantity** to increase the product's stock by.  Manager will enter a **number**.

* A prompt confirms that the product selected will have it's stock increased by the quantity entered.  Manager will confirm and the Store Inventory database will modify the stock for the item.

* A prompt will present the option to modify additional inventory items or to exit.


**4. Add New Product**
This tool will allow for the creation of a new product record in the Store's database.

* A prompt will ask for the **product name**.  Manager will enter the **product name**.

* A prompt will ask for the Store **Department Name** to file the product within.  Manager will enter the **Department Name**.

* A prompt asks for the purchase **price** (USD) in dollars/cent format excluding any currency symbols. Manager will enter the **price**.

* A prompt asks what **quantity** to set the initial inventory stock quantity at.  Manager will enter a **number**.

* The product is then added to the Store's inventory database. A prompt will allow the manager to either add another new item to inventory or to exit.