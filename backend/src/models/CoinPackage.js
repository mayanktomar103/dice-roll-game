const { DataTypes } = require('sequelize');
const { sequelize, BaseModel } = require('../config/db');

class CoinPackage extends BaseModel {
  toJSON() {
    const values = { ...this.get() };
    values._id = values.id;
    return values;
  }
}

CoinPackage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  coins: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  badge: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'CoinPackage',
  tableName: 'coin_packages'
});

module.exports = CoinPackage;
