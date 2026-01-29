import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('URI:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📍 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    console.log('🔌 Ready State:', conn.connection.readyState);
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = await TestModel.create({ test: 'Connection successful!' });
    console.log('✅ Test document created:', testDoc._id);
    
    // Clean up test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('🧹 Test document cleaned up');
    
    await mongoose.connection.close();
    console.log('🔄 Connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication Tips:');
      console.log('1. Check your username and password in the connection string');
      console.log('2. Make sure the user exists in MongoDB Atlas');
      console.log('3. Verify the user has read/write permissions');
    }
    
    if (error.message.includes('network')) {
      console.log('\n💡 Network Tips:');
      console.log('1. Check your internet connection');
      console.log('2. Verify IP address is whitelisted in Atlas');
      console.log('3. Try allowing access from anywhere (0.0.0.0/0)');
    }
    
    process.exit(1);
  }
};

testConnection();