const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const sequelize = connectDB.sequelize;
const CoinPackage = require('../models/CoinPackage');
const User = require('../models/User');

const seedPacks = [
  {
    name: 'Starter Pack',
    coins: 5000,
    price: 99,
    badge: 'Popular',
    active: true
  },
  {
    name: 'Pro Gamer Pack',
    coins: 15000,
    price: 199,
    badge: 'Best Value',
    active: true
  },
  {
    name: 'High Roller Pack',
    coins: 50000,
    price: 499,
    badge: 'Ultimate',
    active: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database and sync tables
    await connectDB();
    console.log('[Seed] Connected and synced MySQL tables.');

    // Seed coin packages
    await CoinPackage.destroy({ where: {}, force: true });
    await CoinPackage.bulkCreate(seedPacks);
    console.log('[Seed] Coin packages seeded successfully!');

    // Seed optional admin user if none exists
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        email: 'admin@diceroll.com',
        password: 'adminpassword123',
        coins: 100000,
        level: 10,
        xp: 950,
        vip: true,
        role: 'admin'
      });
      console.log('[Seed] Admin user created: admin@diceroll.com / adminpassword123');
    }

    await sequelize.close();
    console.log('[Seed] Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
