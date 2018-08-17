const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
const passport = require('passport');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB);
//mongoose.connect('mongodb://localhost/rateapp');
//mongoose.connect('mongodb://vulcan1:<mathematics1@ds145208.mlab.com:45208/rateapp');


app.use(helmet());
app.use(compression());

require('./passport/passport-local');

app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());

const user = require('./routes/userRoute');
const company = require('./routes/companyRoute');
const file = require('./routes/fileRoute');

app.use('/api', user);
app.use('/api', company);
app.use('/api',file);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running on port 3000');
});