const { DataTypes } = require('sequelize');
const { sequelize, BaseModel } = require('../config/db');

class GameHistory extends BaseModel {
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

GameHistory.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bet: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  dice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 6
    }
  },
  reward: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  balanceBefore: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  balanceAfter: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  result: {
    type: DataTypes.ENUM('win', 'lose', 'return'),
    allowNull: false
  },
  xpEarned: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  }
}, {
  sequelize,
  modelName: 'GameHistory',
  tableName: 'game_histories'
});

module.exports = GameHistory;
