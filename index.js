const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root:123@localhost/project');

class User extends Sequelize.Model {}

User.init({
  name: Sequelize.STRING,
  surname: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  phone: Sequelize.STRING,
  role: Sequelize.STRING,
  status: Sequelize.STRING,
  birthday: Sequelize.DATE,
  lat: Sequelize.DOUBLE,
  long: Sequelize.DOUBLE,
	'createdAt': {
            type: Sequelize.DATE(3),
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
        },
        'updatedAt': {
            type: Sequelize.DATE(3),
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
        },
},{
  scopes: {
    activeUsers: {
        where: {
          status: 'active'
        }
    },
  },
  sequelize, 
  modelName: 'user'
});


class Trip extends Sequelize.Model {}

Trip.init({
  price: Sequelize.DECIMAL(10,2),
  status: Sequelize.STRING,
  id_driver: Sequelize.STRING,
  to: Sequelize.STRING,
  from: Sequelize.STRING,
  lat_from: Sequelize.DOUBLE,
  long_from: Sequelize.DOUBLE,
  lat_to: Sequelize.DOUBLE,
  long_to: Sequelize.DOUBLE,
	'createdAt': {
            type: Sequelize.DATE(3),
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
        },
        'updatedAt': {
            type: Sequelize.DATE(3),
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
        },

}, { sequelize, modelName: 'trip' });

UserTrip = sequelize.define('user_trip', {
	'createdAt': {
            type: Sequelize.DATE(3),
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
        },
        'updatedAt': {
            type: Sequelize.DATE(3),
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
        }
})

Trip.belongsToMany(User, {through: 'user_trip'})
User.belongsToMany(Trip, {through: 'user_trip'})


;(async () => {
    await sequelize.sync()
})()


// var express = require('express');
// var app = express();

const express = require('express');
const app = express();
const cors = require('cors');
//app.use(cors({origin: 'http://localhost:3000'}))
const bodyParser = require('body-parser');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const { buildSchema } = require('graphql');
const express_graphql = require('express-graphql');
var http = require('http').Server(app);

let socketioJwt = require('socketio-jwt');

//var io = require('socket.io')(http);
//var io = require('socket.io')(http, { origins: '*:*'});
// const sio = require("socket.io")(http, {
//   handlePreflightRequest: (req, res) => {
//       const headers = {
//           //"Access-Control-Allow-Headers": "Content-Type, Authorization",
//           //"Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
//           "Access-Control-Allow-Credentials": true
//       };
//       res.writeHead(200, headers);
//       res.end();
//   }
// });

// sio.on("connection", () => {
//   console.log("Connected!");
// });
//io.origins(['http://localhost:3000']);
//io.set('origins', 'http://localhost:3000');
//io.origins('*:*') // for latest version
// io.on("connection", socket => {
//   socket.emit('hi')
//   console.log('an user connected with id -----------------------------');
//   socket.on("get_trips", () => {
//     socket.emit('hi trip')
//     console.log('okkkkkkkkkkkkkkkkkk');
//     //collection_foodItems.find({}).then(docs => {
//     //  io.sockets.emit("get_data", docs);
//     //});
//   });
// });



const config = {
  secret: `;dtn',kznm` //тот самый секретный ключ, которым подписывается каждый токен, выдаваемый клиенту
}
// io.set('authorization', socketioJwt.authorize({
//   secret: config.secret,
//   handshake: true
// }));
// io.use((socket, next) => {
//   const token = socket.handshake.query.token;
 
//   // verify token
//   jwt.verify(token, config.secret, (err, decoded) => {
//     if(err) return next(err);
//     // set the user’s mongodb _id to the socket for future use
//     socket._id = decoded._id;
//     next();
//   });
//  });

// io.on('connection', function(socket){
//   console.log('an user connected with id');
//   socket.on('get_trips', () => {
//     console.log('WRONG MESSAGE')
//   })
// });
async function getDriver({id}){
  return await User.findAll({where: {id}})
}

async function getUser({}, context){
  console.log('okkkkk');
  return await User.findAll({where: {id: context.jwt}})
}
async function getUsers(){
  return await User.findAll();
}
async function getActiveUsers(){
  return await User.scope('activeUsers').findAll();
}

async function createUser({email, password, name, surname, phone}){
  User.create({email, password, name, surname, phone, status: 'active'});
}

async function changeProgfile({id, name, surname, password, email}){
  console.log('---------------------------');
  console.log(id, name);
  let toUpdate = await User.findOne({where: {id}})
  console.log(toUpdate);
  return await toUpdate.update({name, surname, password, email}).then(() => {})
}

async function addTrips({price, latFrom, longFrom, latTo, longTo, from, to}, context) {
  let user = await User.findOne({where: {id: context.jwt}})
  let newValues = await user.createTrip({price, lat_from: latFrom, long_from: longFrom, lat_to: latTo, long_to: longTo, status: 'search', from, to});
  return newValues;
}

async function updateLocation({ latitude, longitude}, context){
  let toUpdate = await User.findOne({where: {id: context.jwt}})
  return await toUpdate.update({lat: latitude, long: longitude}).then(() => {})
}

async function getRole({id}, context){
  return await User.findAll({where: {id: context.jwt}})
}


async function getTripsCoordinate({idDriver}) {
  return await Trip.findAll({where: {id_driver: idDriver}}); 
}
async function getUserCoordinate({}, context){
  return await User.findAll({where: {id: context.jwt}})
}

async function changeTrip({id}, context){
  //console.log(id, 'qqqqqqqqqqq');
  let toUpdate = await User.findOne({where: {id: context.jwt}})
  await toUpdate.update({status: 'ride'}).then(() => {})
  let toUpdateTrip = await Trip.findOne({where: {id}})
  await toUpdateTrip.update({status: 'driver_rides', id_driver: context.jwt}).then(() => {})
  return await Trip.findOne({where: {id}})
}

async function myTrips({}, context){
  let user  = await User.findOne({where: {id: context.jwt}})
  let allTrips  = await user.getTrips();
  await console.log(user);
  await console.log('(((((((((((((((((((((((((((((((');
  await console.log(allTrips);
  return allTrips;
}

async function getInfoTrip({}, context) {
  let user = await User.findOne({where: {id: context.jwt}})
  let infoTrip  = await user.getTrips();
  return infoTrip;
}

async function driverFinishTrip({idTrip}, context) {
  let trip = await Trip.findOne({where: {id_driver: context.jwt, id: idTrip }})
  trip.update({ status: 'finish' })
  let driver = await User.findOne({where: {id: context.jwt }})
  driver.update({ status: 'active' })
  return driver
}

async function getDriverCoordinate({idDriver}) {
  return await User.findOne({where: {id: idDriver}})
}

async function driverInLocation({idTrip}, context) {
  let trip = await Trip.findOne({where: {id_driver: context.jwt, id: idTrip }})
  trip.update({ status: 'wait' })
  let driver = await User.findOne({where: {id: context.jwt }})
  driver.update({ status: 'wait' })
  return driver
}

async function updateRole({role}, context){
  console.log(111111111111111111111111111111111111);
  console.log(context.jwt);

  let toUpdate = await User.findOne({where: {id: context.jwt}})
  console.log('update role: ', role);
  return await toUpdate.update({ role }).then(() => {})
}
async function getAvailableTrip({id}, context) {
  let freeDrivers = await User.scope('activeUsers').findOne({where: {id: context.jwt}});
  return await sequelize.query(`SELECT * FROM trips where 6371000 * 2 * ASIN(
    SQRT(
      POWER(
        SIN((lat_from - ABS(`+freeDrivers.lat+`)) * PI() / 180 / 2),
        2
      ) +
      COS(lat_from * PI() / 180) *
      COS(ABS(`+freeDrivers.lat+`) * PI() / 180) *
      POWER(
        SIN((long_from - (`+freeDrivers.long+`)) * PI() / 180 / 2),
        2
      )
    )
    ) < 10000 and status = 'search' `, {
    type: sequelize.QueryTypes.SELECT
  }).then(rows => {
      console.log(rows)
      return rows;
    });
  //return 'error'; 
  //return await User.scope('activeUsers').findAll();
}

var schema = buildSchema(`
type Query {
    getUserCoordinate: [User]
    getUser: [User]
    getUsers: [User]
    getActiveUsers: [User]
    getRole: [User]
    getAvailableTrip: [Trip]
    myTrips: [Trip]
    getInfoTrip: [Trip]
    getTripsCoordinate(idDriver: Int!): [Trip]
    getDriver(id: Int!): [User]
}
type Mutation {
  changeTrip(id: Int!): Trip
  createUser(email: String!, password: String!, name: String!, surname: String!, phone: String!): User
  changeProgfile(id: Int!, name: String!, surname: String!, password: String!, email: String!): User
  addTrips(price: Float!, latFrom: Float!, longFrom: Float!, latTo: Float!, longTo: Float!, from: String!, to: String!): Trip
  updateLocation(latitude: Float!,longitude: Float!): User
  updateRole(role: String!): User
  getDriverCoordinate(idDriver: Int!): User
  driverInLocation(idTrip: Int!): User
  driverFinishTrip(idTrip: Int!): User
}
type Trip {
    id: Int
    price: String
    id_driver: String
    from: String
    to: String
    lat_from: Float
    long_from: Float
    lat_to: Float
    long_to: Float
    createdAt: String
    updatedAt: String
    status: String
}
type User {
    id: Int
    name: String
    surname: String
    role: String
    birthday: String
    long: Float
    lat: Float
    status: String
    password: String
    email: String
    phone: String
    createdAt: String
    updatedAt: String
}
type UserTrip {
  id: Int
  tripId: Int
  userId: Int
  createdAt: String
  updatedAt: String
}
`);

var rootResolvers = {//объект соответствия названий в type Query и type Mutation с функциями-резолверами из JS-кода
  getUser,
  getUsers,
  createUser,
  changeProgfile,
  getActiveUsers,
  addTrips,
  updateLocation,
  getAvailableTrip,
  getRole,
  updateRole,
  changeTrip,
  getUserCoordinate,
  myTrips,
  getInfoTrip,
  getDriverCoordinate,
  getTripsCoordinate,
  driverInLocation,
  driverFinishTrip,
  getDriver,
};


//////

app.use('/graphql', express_graphql(async (req, res, gql) => { 
  const authorization = req.headers.authorization 
  console.log('===============================');
  console.log(authorization);
  console.log('===============================');
  if (authorization && authorization.startsWith('Bearer ')){ //если есть токен
      console.log('token provided')
      const token = authorization.substr("Bearer ".length)
      const decoded = jwt.verify(token, config.secret) //проверяем подпись
      if (decoded){
          console.log('token verified', decoded)

          //let slicedModels  = await getModels(decoded.sub.id) //любая функция, которая готовит контекст для резолвера
          console.log('-------------------');

          console.log(decoded.sub);
          return {
              schema: schema,
              rootValue: rootResolvers,
              graphiql: true, 
              context: {jwt: decoded.sub}//, //в контекст отдаем токен
                        //models: slicedModels} //и, например, объект из ORM/ODM текущего пользователя со всей нужной информацией 
          }
      }
  }
  else { //если токена нет
      return {
          schema: schema, //работают анонимные схема
          rootValue: rootResolvers, //и резолверы
          graphiql: true, 
      }
  }
  
}))

////////////////
/*app.use('/graphql',express_graphql(req => ({
  schema: schema,
  rootValue: root,
  graphiql: true, 
  context: req.headers.authorization && {
      jwt: jwt.verify(req.headers.authorization.substring("Bearer ".length), config.secret)
  }
})));*/
///////////////////


function jwtWare() {
  const { secret } = config;
  return expressJwt({ secret }).unless({ //блюдет доступ к приватным роутам
      path: [
          // public routes that don't require authentication
          '/users/authenticate'
      ]
  });
}

function errorHandler(err, req, res, next) {
  if (typeof (err) === 'string') {
      // custom application error
      return res.status(400).json({ message: err });
  }

  if (err.name === 'UnauthorizedError') { //отлавливает ошибку, высланную из expressJwt
      // jwt authentication error
      return res.status(401).json({ message: 'Invalid Token' });
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message });
}


// мо
//const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];

async function authenticate({ email, password }) { //контроллер авторизации
  //console.log('role ==============');
  //console.log(role)
  const user=  await User.findOne({where: {email, password}});
  //console.log(user);

  if (user) {
      const token = jwt.sign({ sub: user.id, name: user.name, surname: user.surname, role: user.role }, config.secret); //подписывам токен нашим ключем
      console.log(token,'===== token');
      //const { password, ...userWithoutPassword } = user;
      return { //отсылаем интересную инфу
          //...userWithoutPassword,
          token
      };
  }
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(cors());

// use JWT auth to secure the api

// api routes
app.post('/users/authenticate', function (req, res, next) {
  authenticate(req.body)
      .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
      .catch(err => next(err));
});

app.use(jwtWare());

// global error handler
app.get('/', (req, res, next) => {
  res.json({all: 'ok'})
  //next()
});

app.use(errorHandler);

//////

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(5000, function () {
  console.log('Example app listening on port 5000!');
});
