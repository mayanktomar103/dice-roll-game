const { DataTypes } = require('sequelize');
const { sequelize, BaseModel } = require('../config/db');
const bcrypt = require('bcryptjs');

class User extends BaseModel {
  async comparePassword(candidatePassword) {
    if (!this.password) {
      throw new Error('Password field not selected/loaded');
    }
    return await bcrypt.compare(candidatePassword, this.password);
  }

  toJSON() {
    const values = { ...this.get() };
    values._id = values.id;
    return values;
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 20]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  coins: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    validate: {
      min: 0
    }
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  xp: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  vip: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  vipPurchasedAt: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  dailyRewardClaimedAt: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: 'avatar_default'
  },
  totalGames: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalWins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalLosses: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  walletBalance: {
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
  },
  totalDeposits: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalWithdrawals: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalWinnings: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  lastDeposit: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  lastWithdrawal: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('email') && user.email) {
        user.email = user.email.trim().toLowerCase();
      }
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  defaultScope: {
    attributes: { exclude: ['password', 'refreshToken'] }
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] }
    },
    withRefreshToken: {
      attributes: { include: ['refreshToken'] }
    }
  }
});

module.exports = User;
