const { DataTypes } = require('sequelize');
const { sequelize, BaseModel } = require('../config/db');

class Cosmetic extends BaseModel {
  toJSON() {
    const values = { ...this.get() };
    values._id = values.id;
    return values;
  }
}

Cosmetic.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('dice_skin', 'avatar', 'board_theme'),
    defaultValue: 'avatar'
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Cosmetic',
  tableName: 'cosmetics'
});

module.exports = Cosmetic;
