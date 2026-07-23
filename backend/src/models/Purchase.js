const { DataTypes } = require('sequelize');
const { sequelize, BaseModel } = require('../config/db');

class Purchase extends BaseModel {
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

Purchase.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('coin_pack', 'vip'),
    allowNull: false
  },
  packageName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  coinsAdded: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentGateway: {
    type: DataTypes.STRING,
    defaultValue: 'mock'
  },
  status: {
    type: DataTypes.ENUM('completed', 'pending', 'failed'),
    defaultValue: 'completed'
  }
}, {
  sequelize,
  modelName: 'Purchase',
  tableName: 'purchases'
});

module.exports = Purchase;
