const { DataTypes } = require('sequelize');
const { sequelize, BaseModel } = require('../config/db');

class Payment extends BaseModel {
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

Payment.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  paymentId: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  signature: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  gateway: {
    type: DataTypes.STRING,
    defaultValue: 'razorpay'
  },
  type: {
    type: DataTypes.ENUM('vip', 'coin_pack'),
    allowNull: false
  },
  packageName: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  coinsAdded: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR'
  },
  status: {
    type: DataTypes.ENUM('created', 'completed', 'failed'),
    defaultValue: 'created'
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  sequelize,
  modelName: 'Payment',
  tableName: 'payments'
});

module.exports = Payment;
