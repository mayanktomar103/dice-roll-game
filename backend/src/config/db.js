const { Sequelize, Model } = require('sequelize');

const mysqlUri = process.env.MYSQL_URI || 'mysql://root:rootpassword@127.0.0.1:3306/diceroll';
const sequelize = new Sequelize(mysqlUri, {
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: true
  }
});

class BaseModel extends Model {
  get _id() {
    return this.id;
  }

  static findById(id, options) {
    if (!id) return null;
    return this.findByPk(id, options);
  }

  static findOne(options) {
    if (options && !options.hasOwnProperty('where') && !options.hasOwnProperty('attributes') && !options.hasOwnProperty('include')) {
      return super.findOne({ where: options });
    }
    return super.findOne(options);
  }

  static find(options) {
    if (options && !options.hasOwnProperty('where') && !options.hasOwnProperty('attributes') && !options.hasOwnProperty('include')) {
      return super.findAll({ where: options });
    }
    return super.findAll(options || {});
  }

  static countDocuments(where = {}) {
    return this.count({ where });
  }

  static async findByIdAndUpdate(id, updates, options = {}) {
    const instance = await this.findByPk(id);
    if (!instance) return null;
    await instance.update(updates);
    return instance;
  }
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('[MySQL] Connection has been established successfully.');

    // Load models to register them and define associations
    const User = require('../models/User');
    const CoinPackage = require('../models/CoinPackage');
    const Cosmetic = require('../models/Cosmetic');
    const GameHistory = require('../models/GameHistory');
    const Purchase = require('../models/Purchase');
    const Payment = require('../payment/payment.model');
    const Wallet = require('../wallet/wallet.model');
    const Transaction = require('../wallet/transaction.model');

    // Define Associations
    User.hasMany(GameHistory, { foreignKey: 'userId', as: 'gameHistories' });
    GameHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    User.hasMany(Purchase, { foreignKey: 'userId', as: 'purchases' });
    Purchase.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
    Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet' });
    Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
    Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

    // Sync Database
    await sequelize.sync({ alter: true });
    console.log('[MySQL] Database synced.');
  } catch (error) {
    console.error('[MySQL Connection/Sync Error]', error);
    process.exit(1);
  }
};

connectDB.sequelize = sequelize;
connectDB.BaseModel = BaseModel;

module.exports = connectDB;
