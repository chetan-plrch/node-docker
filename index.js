const express = require('express')
const mongoose = require('mongoose');
const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_IP, REDIS_PORT, REDIS_SESSION_SECRET } = require('./config');
const postRouter = require('./routes/postRoutes');
const authRouter = require('./routes/authRoutes');
const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
const redis = require('redis')
const session = require('express-session')
const { protect } = require('./middleware/authMiddleware')

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({
    host: REDIS_IP,
    port: REDIS_PORT
})

const retryConnection = () => {
    mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
    })
    .then(() => console.log('Connected successfull to database'))
    .catch((e) => {
        console.log("Failed to connect to mongo",e)
        setTimeout(retryConnection, 5000)
    })
}

retryConnection();

const app = express();

app.use(express.json());
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: REDIS_SESSION_SECRET,
        cookie: {
            secure: false,
            resave: false,
            saveUninitialized: false,
            httpOnly: true,
            maxAge: 60000
        }
    })
)

app.get('/api', (req, res) => {
    return res.json({ "status": "This is also success message good" })
})

app.use('/api/posts', protect, postRouter)
app.use('/api/users', authRouter);

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))