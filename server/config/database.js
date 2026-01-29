import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('🔄 Attempting MongoDB Atlas connection...');
    
    // Connection strategies to handle SSL issues
    const strategies = [
      // Strategy 1: Standard connection with SSL
      {
        name: 'Standard SSL',
        options: {}
      },
      // Strategy 2: Disable SSL validation (for development)
      {
        name: 'SSL with invalid certificates allowed',
        options: {
          tls: true,
          tlsAllowInvalidCertificates: true,
          tlsAllowInvalidHostnames: true
        }
      },
      // Strategy 3: Force SSL off (if supported)
      {
        name: 'No SSL',
        options: {
          ssl: false,
          tls: false
        }
      }
    ];

    let connected = false;
    let lastError = null;

    for (const strategy of strategies) {
      if (connected) break;
      
      try {
        console.log(`🔄 Trying: ${strategy.name}...`);
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 10000, // 10 second timeout
          socketTimeoutMS: 45000, // 45 second socket timeout
          bufferCommands: false,
          maxPoolSize: 10,
          ...strategy.options
        });
        
        console.log(`✅ MongoDB Connected Successfully!`);
        console.log(`📍 Host: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        console.log(`🔌 Ready State: ${conn.connection.readyState}`);
        
        process.env.MONGODB_CONNECTED = 'true';
        connected = true;
        
        // Test the connection with a simple operation
        await mongoose.connection.db.admin().ping();
        console.log('✅ Database ping successful');
        
        // Set up connection event handlers
        mongoose.connection.on('error', (err) => {
          console.error('❌ MongoDB connection error:', err.message);
          process.env.MONGODB_CONNECTED = 'false';
        });

        mongoose.connection.on('disconnected', () => {
          console.log('⚠️ MongoDB disconnected');
          process.env.MONGODB_CONNECTED = 'false';
        });

        mongoose.connection.on('reconnected', () => {
          console.log('✅ MongoDB reconnected');
          process.env.MONGODB_CONNECTED = 'true';
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
          try {
            await mongoose.connection.close();
            console.log('🔄 MongoDB connection closed gracefully');
          } catch (err) {
            console.error('Error closing MongoDB connection:', err);
          }
          process.exit(0);
        });

        break; // Exit the loop on successful connection
        
      } catch (error) {
        lastError = error;
        console.log(`❌ ${strategy.name} failed: ${error.message}`);
        
        // Clean up any partial connection
        if (mongoose.connection.readyState !== 0) {
          await mongoose.connection.close();
        }
      }
    }

    if (!connected) {
      console.error('❌ All MongoDB connection strategies failed');
      console.error('💡 Common solutions:');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify MongoDB Atlas credentials');
      console.error('   3. Ensure IP address is whitelisted (0.0.0.0/0)');
      console.error('   4. Check if the cluster is running');
      console.log('⚠️ Server will continue with in-memory database');
      process.env.MONGODB_CONNECTED = 'false';
    }

  } catch (error) {
    console.error('❌ Database connection setup failed:', error.message);
    console.log('⚠️ Server will continue with in-memory database');
    process.env.MONGODB_CONNECTED = 'false';
  }
};

export default connectDB;