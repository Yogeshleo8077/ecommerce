import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, UserRole } from './models/user.model';
import { Product } from './models/product.model';
import { connectDB } from './config/db';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Database cleared!');

    // Create an Admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'password123',
      role: UserRole.ADMIN,
      isEmailVerified: true,
    });
    console.log('Admin user created!');

    // Dummy products
    const dummyProducts = [
      {
        name: 'Premium Wireless Headphones',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'],
        description: 'Experience pure sound quality with our noise-cancelling technology and comfortable over-ear design.',
        price: 299.99,
        category: 'Electronics',
        brand: 'AudioTech',
        stock: 10,
        ratings: 4.5,
        numReviews: 12,
        createdBy: adminUser._id,
      },
      {
        name: 'Minimalist Smartwatch',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'],
        description: 'Track your fitness, notifications, and time with this elegant, minimalist smartwatch.',
        price: 199.50,
        category: 'Electronics',
        brand: 'SmartWear',
        stock: 5,
        ratings: 4.0,
        numReviews: 8,
        createdBy: adminUser._id,
      },
      {
        name: 'Ergonomic Office Chair',
        images: ['https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop'],
        description: 'Work in comfort all day long with our fully adjustable ergonomic office chair.',
        price: 349.00,
        category: 'Furniture',
        brand: 'ComfortPlus',
        stock: 0,
        ratings: 5.0,
        numReviews: 24,
        createdBy: adminUser._id,
      },
      {
        name: 'Mechanical Gaming Keyboard',
        images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop'],
        description: 'RGB backlit mechanical keyboard with tactile switches for the ultimate gaming experience.',
        price: 129.99,
        category: 'Electronics',
        brand: 'GamePro',
        stock: 15,
        ratings: 4.8,
        numReviews: 56,
        createdBy: adminUser._id,
      },
      {
        name: '4K Ultra HD Action Camera',
        images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop'],
        description: 'Capture your adventures in stunning 4K resolution. Waterproof and incredibly durable.',
        price: 249.00,
        category: 'Electronics',
        brand: 'CamX',
        stock: 8,
        ratings: 4.2,
        numReviews: 19,
        createdBy: adminUser._id,
      },
      {
        name: 'Portable Bluetooth Speaker',
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop'],
        description: 'Take your music anywhere with this powerful, waterproof portable speaker.',
        price: 89.99,
        category: 'Electronics',
        brand: 'SoundBox',
        stock: 30,
        ratings: 4.6,
        numReviews: 104,
        createdBy: adminUser._id,
      },
      {
        name: 'Smart Home Security Camera',
        images: ['https://images.unsplash.com/photo-1557825835-70d97c4aa567?q=80&w=1000&auto=format&fit=crop'],
        description: 'Keep your home safe with 1080p HD video, night vision, and two-way audio.',
        price: 59.99,
        category: 'Electronics',
        brand: 'SecureHome',
        stock: 25,
        ratings: 4.3,
        numReviews: 45,
        createdBy: adminUser._id,
      },
      {
        name: 'Professional DSLR Camera',
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop'],
        description: 'Capture professional-grade photos with a 24.2 MP sensor and interchangeable lenses.',
        price: 899.00,
        category: 'Electronics',
        brand: 'PhotoPro',
        stock: 4,
        ratings: 4.9,
        numReviews: 112,
        createdBy: adminUser._id,
      },
      {
        name: 'Noise-Cancelling Earbuds',
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop'],
        description: 'True wireless earbuds with active noise cancellation and 24-hour battery life.',
        price: 149.50,
        category: 'Electronics',
        brand: 'AudioTech',
        stock: 40,
        ratings: 4.7,
        numReviews: 230,
        createdBy: adminUser._id,
      },
      {
        name: 'Gaming Mouse pad RGB',
        images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c3c9c?q=80&w=1000&auto=format&fit=crop'],
        description: 'Large RGB gaming mouse pad with micro-textured cloth surface.',
        price: 29.99,
        category: 'Electronics',
        brand: 'GamePro',
        stock: 100,
        ratings: 4.8,
        numReviews: 89,
        createdBy: adminUser._id,
      },
      {
        name: 'Electric Standing Desk',
        images: ['https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=1000&auto=format&fit=crop'],
        description: 'Adjustable height electric standing desk for a healthier workspace.',
        price: 499.00,
        category: 'Furniture',
        brand: 'WorkFit',
        stock: 12,
        ratings: 4.6,
        numReviews: 67,
        createdBy: adminUser._id,
      },
      {
        name: 'Wireless Charging Pad',
        images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop'],
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
        price: 19.99,
        category: 'Electronics',
        brand: 'ChargeFast',
        stock: 60,
        ratings: 4.1,
        numReviews: 34,
        createdBy: adminUser._id,
      },
      {
        name: 'Smart LED Light Bulb',
        images: ['https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop'],
        description: 'Color changing smart LED bulb that works with voice assistants.',
        price: 15.00,
        category: 'Home',
        brand: 'SmartHome',
        stock: 80,
        ratings: 4.4,
        numReviews: 210,
        createdBy: adminUser._id,
      },
      {
        name: 'Fitness Tracker Band',
        images: ['https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=1000&auto=format&fit=crop'],
        description: 'Monitor your heart rate, sleep, and steps with this slim fitness tracker.',
        price: 49.95,
        category: 'Electronics',
        brand: 'FitLife',
        stock: 35,
        ratings: 4.2,
        numReviews: 125,
        createdBy: adminUser._id,
      }
    ];

    await Product.insertMany(dummyProducts);
    console.log('Dummy products seeded successfully!');

    process.exit();
  } catch (error) {
    console.error('Error with seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
