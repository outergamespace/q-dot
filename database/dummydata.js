const db = require('./index.js');
const dbQuery = require('../controller/index.js');
// const dbUserController = require('../controller/user.js');

const addToQueue = () => {
  return dbQuery.addToQueue({name: 'Tiffany', restaurantId: 1, size: 2, mobile: '4158475697'})
    .then(() => dbQuery.addToQueue({name: 'Neha', restaurantId: 1, size: 3, mobile: '4158965693', email: 'nez@gmail.com'}))
    .then(() => dbQuery.addToQueue({name: 'Eugene', restaurantId: 2, size: 3, mobile: '4157855678', email: 'eugene@gmail.com'}))
    .then(() => dbQuery.addToQueue({name: 'Johnny', restaurantId: 2, size: 2, mobile: '4156844758'}));
};

const addRestaurants = () => {
  return db.Restaurant.findOrCreate({where: {name: 'Tempest', phone: '(123) 456-7890', image: '../images/tempestbar.jpg', status: 'Open', 'average_wait': 10, 'total_wait': 10}})
    .then(() => db.Restaurant.findOrCreate({where: {name: 'House of Prime Rib', phone: '(415) 885-4605', image: '../images/houseofprimerib.jpg', status: 'Open', 'average_wait': 10, 'total_wait': 10}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Tsunami Panhandle', phone: '(415) 567-7664', image: '../images/tsunamipanhandle.jpg', status: 'Open', 'average_wait': 5, 'total_wait': 5}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Kitchen Story', phone: '(415) 525-4905', image: '../images/kitchenstory.jpg', status: 'Open', 'average_wait': 15, 'total_wait': 15}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Burma Superstar', phone: '(415) 387-2147', image: '../images/burmasuperstar.jpg', status: 'Open', 'average_wait': 10, 'total_wait': 10}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'State Bird Provisions', phone: '(415) 795-1272', image: '../images/statebirdprovisions.jpg', status: 'Closed', 'average_wait': 8, 'total_wait': 8}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Limon Rotisserie', phone: '(415) 821-2134', image: '../images/limonrotisserie.jpg', status: 'Closed', 'average_wait': 12, 'total_wait': 12}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Nopa', phone: '(415) 864-8643', image: '../images/nopa.jpg', status: 'Open', 'average_wait': 20, 'total_wait': 20}}))
    .then(() => db.Restaurant.findOrCreate({where: {name: 'Farmhouse Kitchen', phone: '(415) 814-2920', image: '../images/farmhousekitchen.jpg', status: 'Open', 'average_wait': 15, 'total_wait': 15}}));
};

const addManager = () => {
  return db.Manager.findOrCreate({
    where: {
      username: 'johnny',
      passwordHash: 'a48af21cebc18c880a2b9c53dd8b3fab483e26ff2b7b77dd9def2afe8305ff44b17f1b8d58e6106bb49570e602fde2b960e0e420d53874b2d8626016bbd97f83',
      passwordSalt: '8b1269b13d1258b15af6c66f4f4d5cd9'
    }
  });
};

// const addUsers = () => {
//   // return dbUserController.addUser(
//   //   'lam',
//   //   'b83b115e06da6c88b745873ebb2cfc5677e68b5bdc83d3e221feb32ad4ea33dc7326122e64ac67792bd911507a7f0658bc2962f0c9d656cf810656af98e87eb5',
//   //   '8162531bb95b0ff39b8cfdd761642748',
//   //   'manager'
//   // ).then(
//   //   'customer1',
//   //   '24a41efa18fb5e14f8d897f716fb7ab3d72386bdaaf8e42f0bbddd8234247076cbcbccb68d26b68a4681688c903bb22bca15f3cd1a911c004edc718c3cd531da',
//   //   '430f3e23151708e8116ba7b4bac693b7',
//   //   'customer'
//   // ).then(
//   //   'customer2',
//   //   '05fcd24f6b65883c3f44050e68edb0edb8bd217be3e324208f445f929cfcbfd03d09e84f7f6993fd208725c5102fa2281bd59d4560d83c07adddc05bdaf6255b',
//   //   '35284da54c7c78b6b722eb2af82321c0',
//   //   'customer'
//   // ).then(
//   //   'customer3',
//   //   '23a98fb2abbd035b42977222c6d4978eb077a77fe34c06b855fe19fcaa74b97981ceac9cb53ef6798d6bdf632ffb9677debcfb25cb753db35214f025758aaba1',
//   //   '15784eacee916913532b9833ecd0b7d9',
//   //   'customer'
//   // );
// };

const dropDB = () => {
  return db.Queue.drop()
    .then(() => db.Customer.drop())
    .then(() => db.Restaurant.drop())
    .then(() => db.ManagerAudit.drop())
    .then(() => db.Manager.drop())
    .then(() => db.Restaurant.sync({force: true}))
    .then(() => db.Customer.sync({force: true}))
    .then(() => db.Queue.sync({force: true}))
    .then(() => db.Manager.sync({force: true}))
    .then(() => db.ManagerAudit.sync({force: true}))
    .then(() => addRestaurants())
    .then(() => addToQueue())
    .then(() => addManager());
};

module.exports = {
  addRestaurants: addRestaurants,
  addToQueue: addToQueue,
  addManager: addManager,
  dropDB: dropDB
};
