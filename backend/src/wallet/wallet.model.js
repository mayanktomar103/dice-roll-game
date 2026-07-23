const { DataTypes } = require('sequelize');
const { sequelize, BaseModel } = require('../config/db');

class Wallet extends BaseModel {
  toJSON() {
    const values = { ...this.get() };
    values._id = values.id;
    if (values.user && typeof values.user === 'object') {
      // relation is loaded, keep as object
    } else {
      values.user = values.userId;
    }
    return values;
  }
}

Wallet.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  balance: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  lockedBalance: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
}, {
  sequelize,
  modelName: 'Wallet',
  tableName: 'wallets'
});

module.exports = Wallet;
