const Sequelize = require('sequelize');
let db;

if (process.env.DATABASE_URL) {
  db = new Sequelize(process.env.DATABASE_URL);
} else {
  db = new Sequelize({
    database: process.env.QDOT_DB_NAME || 'qdot',
    username: process.env.QDOT_DB_USERNAME || 'postgres',
    password: process.env.QDOT_DB_PASSWORD || 'qdot',
    dialect: 'postgres',
    port: process.env.QDOT_DB_PORT || 5433, // 5432 for most
    logging: false,
  });
}

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// User Schema
const User = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: Sequelize.STRING,
  passwordHash: Sequelize.STRING,
  passwordSalt: Sequelize.STRING,
  role: Sequelize.ENUM('manager', 'customer')
});

// UserProfile Schema
const UserProfile = db.define('userprofile', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // name: Sequelize.STRING,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  mobile: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  email: Sequelize.STRING,
  // userId: Sequelize.INTEGER
});

//Manager Audit History Schema
const ManagerAudit = db.define('manageraudit', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: Sequelize.STRING
});

//Manager Schema
const Manager = db.define('manager', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: Sequelize.STRING,
  passwordHash: Sequelize.STRING,
  passwordSalt: Sequelize.STRING
});

//Customer Schema
const Customer = db.define('customer', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  mobile: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  email: Sequelize.STRING
});

//Queue Schema
const Queue = db.define('queue', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  size: Sequelize.INTEGER,
  wait: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  position: Sequelize.INTEGER
});

//Restaurant Schema
const Restaurant = db.define('restaurant', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  phone: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  nextPosition: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  'total_wait': {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  'average_wait': {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  status: Sequelize.STRING,
  image: Sequelize.STRING
});

// Relationship between User and UserProfile
User.hasOne(UserProfile);
UserProfile.belongsTo(User);

// possibly the right way, but adds are not associating the foreign key properly
// User.UserProfile = UserProfile.belongsTo(User);
// User.hasOne(UserProfile);

// Product.User = Product.belongsTo(User);
// User.Addresses = User.hasMany(Address);;
// User.UserProfile = UserProfile.belongsTo(User);
// User.hasOne(UserProfile);

// Relationship between Restaurant & Queue
Restaurant.hasMany(Queue);
Queue.belongsTo(Restaurant);

//Relationship between Customer & Queue
Customer.hasOne(Queue);
Queue.belongsTo(Customer);

//Relationship between Manager & ManagerAudit
Manager.hasOne(ManagerAudit);
ManagerAudit.belongsTo(Manager);

Customer.sync()
  .then(() => Restaurant.sync())
  .then(() => Queue.sync())
  .catch(error => console.log('error syncing data', error));

module.exports = {
  Sequelize: Sequelize,
  db: db,
  User: User,
  UserProfile: UserProfile,
  Customer: Customer,
  Queue: Queue,
  Restaurant: Restaurant,
  Manager: Manager,
  ManagerAudit: ManagerAudit
};
