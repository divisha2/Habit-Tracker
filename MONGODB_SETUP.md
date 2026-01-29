# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose the **FREE** M0 cluster (512MB storage, perfect for development)

## Step 2: Create a Cluster

1. After signing up, you'll be prompted to create a cluster
2. Choose **AWS** as the cloud provider
3. Select the **FREE** tier (M0 Sandbox)
4. Choose a region close to you
5. Name your cluster (e.g., "zen-habits-cluster")
6. Click "Create Cluster"

## Step 3: Create Database User

1. In the Atlas dashboard, go to "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `zenhabits`
5. Password: `zenhabits2026` (or create your own secure password)
6. Database User Privileges: Select "Read and write to any database"
7. Click "Add User"

## Step 4: Configure Network Access

1. Go to "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - This is for development. In production, restrict to specific IPs
4. Click "Confirm"

## Step 5: Get Connection String

1. Go to "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string (it looks like):
   ```
   mongodb+srv://zenhabits:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File

Replace the placeholder in `server/.env` with your real connection string:

```env
# Replace this line:
MONGODB_URI=mongodb+srv://zenhabits:zenhabits2026@cluster0.xxxxx.mongodb.net/zen-habit-tracker?retryWrites=true&w=majority

# With your actual connection string:
MONGODB_URI=mongodb+srv://zenhabits:zenhabits2026@cluster0.YOURCLUSTER.mongodb.net/zen-habit-tracker?retryWrites=true&w=majority
```

**Important**: 
- Replace `<password>` with your actual password
- Replace `YOURCLUSTER` with your actual cluster identifier
- Add `/zen-habit-tracker` before the `?` to specify the database name

## Step 7: Test Connection

Run the connection test:
```bash
cd server
npm run test-db
```

You should see:
```
✅ MongoDB Connected Successfully!
📍 Host: cluster0-xxxxx.mongodb.net
📊 Database: zen-habit-tracker
```

## Step 8: Restart Your Server

```bash
npm run server:dev
```

The server should now show:
```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
🚀 Server running on port 5000
```

## Troubleshooting

### Authentication Failed
- Double-check username and password in connection string
- Ensure the database user exists in Atlas
- Verify user has read/write permissions

### Network Timeout
- Check if your IP is whitelisted (or use 0.0.0.0/0 for development)
- Verify internet connection
- Try a different network

### Connection String Issues
- Ensure no spaces in the connection string
- Check that the cluster name is correct
- Make sure you added the database name (`zen-habit-tracker`)

## Security Notes

For production deployment:
1. Use environment-specific connection strings
2. Restrict IP access to your server's IP only
3. Use strong, unique passwords
4. Enable MongoDB Atlas security features
5. Regular backup your database

---

Once connected, your app will have full persistence and support multiple users with separate data!