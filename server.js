const express = require("express");
const app = express();
const fs = require("fs");

const basket = JSON.parse(fs.readFileSync("./static/jsons/basket.json"));

app.use(express.json());
app.listen(3000);

app.use('/static', express.static(__dirname + '/static'));


app.get('/', (req, res) => {
  res.sendFile(__dirname+"\\html\\landingPage.html")
}
)

app.get('/auth', (req, res) => {
  res.sendFile(__dirname+"\\html\\auth.html")
}
)

app.get('/menu', (req, res) => {

  res.sendFile(__dirname+"\\html\\menuPage.html")
}
)
app.get('/basket', (req, res) => {

  res.sendFile(__dirname+"\\html\\basketPage.html")
}
)

app.get('/orders', (req, res) => {

  res.sendFile(__dirname+"\\html\\orderPage.html")
}
)

app.get('/picar', (req, res) => {

  res.sendFile(__dirname+"\\html\\picarPage.html")
}
)

app.get('/profile', (req, res) => {

  res.sendFile(__dirname+"\\html\\profilePage.html")
}
)

app.post('/basket/add', (req, res) => {
  const newItem = req.body;

  basket.push(newItem);

  fs.writeFileSync("./static/jsons/basket.json", JSON.stringify(basket,null, 2));
  res.json({ message: "Item added to basket successfully" });
})

app.post('/basket/remove', (req, res) => {
  const removeItem = req.body;

  basket = basket.filter(function(product){
    return product.productId !== removeItem.productId
  })

  fs.writeFileSync("./static/jsons/basket.json", JSON.stringify(basket,null, 2));
  res.json({ message: "Item added to basket successfully" });
})