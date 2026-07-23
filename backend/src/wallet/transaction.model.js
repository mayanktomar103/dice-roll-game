const { DataTypes } = require('sequelize');
const { sequelize, BaseModel } = require('../config/db');

class Transaction extends BaseModel {
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

Transaction.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM(
      'Deposit',
      'Withdrawal',
      'Game Bet',
      'Game Win',
      'VIP Purchase',
      'Coin Pack Purchase'
    ),
    allowNull: false
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  balanceBefore: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  balanceAfter: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('completed', 'pending', 'failed'),
    defaultValue: 'completed'
  },
  reference: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  sequelize,
  modelName: 'Transaction',
  tableName: 'transactions'
});

module.exports = Transaction;
