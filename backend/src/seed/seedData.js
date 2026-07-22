const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CoinPackage = require('../models/CoinPackage');
const User = require('../models/User');

dotenv.config();

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
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/diceroll';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Seed coin packages
    await CoinPackage.deleteMany({});
    await CoinPackage.insertMany(seedPacks);
    console.log('[Seed] Coin packages seeded successfully!');

    // Seed optional admin user if none exists
    const adminExists = await User.findOne({ role: 'admin' });
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

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
