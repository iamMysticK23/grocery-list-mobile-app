// database setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://grocery-list-ke-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

// shopping cart list
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")


// add an item to the shopping list
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    push(shoppingListInDB, inputValue)

    clearInputFieldEl()
  
})

// get item from the database and add to the list
onValue(shoppingListInDB, function (snapshot) {

    // if there is nothing in cart, display no items in cart
    if (snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val())

        clearShoppingListEl()
    
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
    
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items in cart"
    }
})

// clear the shopping list
function clearShoppingListEl(){
    shoppingListEl.innerHTML = ""
}

// clear the input field
function clearInputFieldEl(){
    inputFieldEl.value = ""
}

// append an item to the shopping list
function appendItemToShoppingListEl(item) {

    let itemID = item[0]
    let itemValue = item[1]
   
    let newEl = document.createElement("li")
    newEl.textContent = itemValue

    // remove item from grocery list
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database,`shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)


    })

    shoppingListEl.append(newEl)
}