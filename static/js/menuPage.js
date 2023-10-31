
import products from "../jsons/menu.json" assert { type: 'json' }; 

var menu = document.getElementById('MenuId');

document.addEventListener("DOMContentLoaded", function () {
  for(let i = 0; i< products.length; i++){
    let product = document.createElement('div');
    product.classList.add('productCont');
    product.id = products[i].id;

    let itemTitle = document.createElement('div');
    itemTitle.classList.add('item-title');
    itemTitle.innerHTML = products[i].name;

    let itemPrice = document.createElement('div');
    itemPrice.classList.add('item-price');
    itemPrice.innerHTML = products[i].price;

    let button = document.createElement('div');
    button.classList.add('addToBasket');
    button.innerHTML = "add to basket";

    button.addEventListener('click', function() {
      const newItem = { productId: products[i].id };

      fetch("/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      })
        .then((response) => {
          if (response.ok) {
            console.log("Item added to basket successfully");
          } else {
            console.error("Failed to add item to basket");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });

    product.appendChild(itemTitle);
    product.appendChild(itemPrice);
    product.appendChild(button);

    menu.appendChild(product);
  }

});


