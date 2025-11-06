const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema (sama seperti di models/User.js)
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

// Data users yang akan dibuat
const usersData = [
  // 4 Admin
  {
    username: 'admin1',
    email: 'admin1@payungteduh.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'admin2',
    email: 'admin2@payungteduh.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'admin3',
    email: 'admin3@payungteduh.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'admin4',
    email: 'admin4@payungteduh.com',
    password: 'admin123',
    role: 'admin'
  },
  // 2 User
  {
    username: 'user1',
    email: 'user1@gmail.com',
    password: 'user123',
    role: 'user'
  },
  {
    username: 'user2',
    email: 'user2@gmail.com',
    password: 'user123',
    role: 'user'
  }
];

// Function untuk hash password dan insert users
async function seedUsers() {
  try {
    // Connect ke MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Hapus semua user yang ada (optional - hati-hati!)
    // await User.deleteMany({});
    // console.log('🗑️  Existing users cleared');

    // Hash password dan insert users
    const usersWithHashedPassword = await Promise.all(
      usersData.map(async (userData) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        return {
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          createdAt: new Date()
        };
      })
    );

    // Insert users ke database
    const result = await User.insertMany(usersWithHashedPassword);
    
    console.log(`\n✅ ${result.length} users berhasil dibuat!\n`);
    
    // Tampilkan info users
    console.log('📋 DAFTAR USERS:\n');
    console.log('=== ADMIN ACCOUNTS ===');
    usersData.filter(u => u.role === 'admin').forEach(u => {
      console.log(`Username: ${u.username}`);
      console.log(`Email: ${u.email}`);
      console.log(`Password: ${u.password}`);
      console.log('---');
    });
    
    console.log('\n=== USER ACCOUNTS ===');
    usersData.filter(u => u.role === 'user').forEach(u => {
      console.log(`Username: ${u.username}`);
      console.log(`Email: ${u.email}`);
      console.log(`Password: ${u.password}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the seed function
seedUsers();