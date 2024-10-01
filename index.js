// Server Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")
const cartRoutes = require("./routes/cart")
const checkoutRoutes = require("./routes/checkout")
const dotenv = require('dotenv')
dotenv.config()

// Server Setup
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

mongoose.connect(process.env.MONGODB_URI,
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

// Group all cart routes
app.use("/cart", cartRoutes);

// Group all checkout routes
app.use("/checkout", checkoutRoutes);

// Server Gateway Response

if(require.main === module) {
	app.listen(process.env.PORT, () => { console.log(`Server is now running in port ${process.env.PORT}.`)});
};

module.exports = {app, mongoose};
