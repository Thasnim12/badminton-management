const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
const connectDB = require('./connections/dbConnection')
const userroute = require('./routes/userRoutes')
const adminroute = require('./routes/adminRoutes')


const app = express();

dotenv.config();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users',userroute);
app.use('/api/admin',adminroute)


app.use((req, res, next) => {
    console.log(req.method, req.path, req.body);
    next();
  });
  

  (async () => {
    try {
        await connectDB();
        console.log("Database connected, starting server...");
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to connect to database. Server not started.");
        process.exit(1);
    }
})();