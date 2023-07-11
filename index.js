// Server Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")

// Server Setup
const app = express();

// Environment Setup
const port = 4000;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

mongoose.connect("mongodb+srv://joG:admin123@b295.gdrdocw.mongodb.net/capstone2-Ecommerce-API?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	);


let db = mongoose.connection;

db.on('error', console.error.bind(console,'Connection error'));
db.once('open', () => console.log('Connected to MongoDB Atlas.'));


// Backend Routes
// http://localhost:4000/users
app.use("/users", userRoutes);

// Group all product routes
app.use("/products", productRoutes);

// Group all order routes
app.use("/orders", orderRoutes);



// Server Gateway Response

if(require.main === module) {
	app.listen(process.env.PORT || port, () => { console.log(`Server is now running in port ${process.env.PORT || port}.`)});
};




module.exports = {app, mongoose};



