const express = require('express'); //Express framework to create the server and handle routes
const app = express(); //initialize the app
const path = require('path'); //Allows working with file a directory paths
const methodOverride = require('method-override'); //Allows the use of PUT and DELETE in forms
const session = require('express-session'); //Manager of user sessions
const productsRouter = require('./routes/products'); //Route for products
const ordersRoute = require('./routes/orders'); //Route for orders
const authRoute = require('./routes/auth'); //Route for authentication
const userRoutes = require('./routes/user'); // Import user routes
const db = require('./db'); // Ensure this is imported if not already

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); 
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.userId; // Check if userId exists in the session
    next();
});

app.use(methodOverride((req, res) => {
    if (req.body && req.body._method) {
        console.log(`Original method: ${req.method}, _method: ${req.body._method}`);
        return req.body._method; // Override the method
    }
}));

// Routes
app.use('/', userRoutes); // Register user routes
app.use('/products', productsRouter);
app.use('/orders', ordersRoute);
app.use('/auth', authRoute);

app.get('/', (req, res) => {
    res.render('index'); // Pass variables to the EJS template
});
// Route for the add product page
app.get('/addproduct', (req, res) => {
    res.render('addproduct'); // Render the addproduct.ejs file
});

// Route for the contact us page
app.get('/contactus', (req, res) => {
    res.render('contactus'); // Render the contactus.ejs file
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});