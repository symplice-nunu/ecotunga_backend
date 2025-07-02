# Waste Collections Loading Issue - Troubleshooting Guide

## 🔍 **Problem Description**
Users are seeing "Error Loading Collections" with "Failed to load waste collections" message when trying to view waste collections.

## 🚀 **Quick Fix Steps**

### 1. **Check Backend Server Status**
```bash
cd ecotunga_backend
npm start
```
Ensure the server is running on port 5001.

### 2. **Check Database Connection**
Verify your `.env` file has correct database credentials:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
```

### 3. **Run Database Migrations**
```bash
cd ecotunga_backend
npx knex migrate:latest
```

### 4. **Test API Endpoints**
Use the debug component in the frontend or test manually:

#### Test Basic Connection:
```bash
curl http://localhost:5001/api/test
```

#### Test Waste Collection Routes:
```bash
curl http://localhost:5001/api/waste-collections/test
```

#### Test Database Structure:
```bash
curl http://localhost:5001/api/waste-collections/debug
```

## 🔧 **Common Issues & Solutions**

### **Issue 1: Database Connection Failed**
**Symptoms:** Backend server won't start or shows database connection errors.

**Solutions:**
1. Check MySQL service is running
2. Verify database credentials in `.env`
3. Ensure database exists
4. Check network connectivity

### **Issue 2: Authentication Token Missing/Invalid**
**Symptoms:** 401 Unauthorized errors in browser console.

**Solutions:**
1. Clear browser localStorage: `localStorage.clear()`
2. Log out and log back in
3. Check JWT_SECRET in backend `.env`
4. Verify token format in browser dev tools

### **Issue 3: Database Tables Missing**
**Symptoms:** 500 errors or "table doesn't exist" messages.

**Solutions:**
1. Run migrations: `npx knex migrate:latest`
2. Check migration status: `npx knex migrate:status`
3. Reset database if needed: `npx knex migrate:rollback --all && npx knex migrate:latest`

### **Issue 4: CORS Issues**
**Symptoms:** Network errors in browser console.

**Solutions:**
1. Check CORS configuration in `server.js`
2. Ensure frontend is running on allowed origins
3. Clear browser cache

### **Issue 5: User Role Issues**
**Symptoms:** 403 Forbidden errors or wrong data returned.

**Solutions:**
1. Check user role in database
2. Verify role-based access logic
3. Update user role if needed

## 🛠️ **Debug Tools Added**

### **Frontend Debug Component**
A debug component has been added to the WasteCollections page that will:
- Test basic API connection
- Test waste collection routes
- Test database structure
- Test authentication

### **Backend Debug Endpoints**
New debug endpoints added:
- `GET /api/waste-collections/test` - Test route mounting
- `GET /api/waste-collections/debug` - Database structure check
- `GET /api/waste-collections/test-auth` - Authentication test

## 📋 **Step-by-Step Debug Process**

1. **Start Backend Server**
   ```bash
   cd ecotunga_backend
   npm start
   ```

2. **Check Console Output**
   Look for:
   - Database connection success
   - Route mounting messages
   - Any error messages

3. **Test API Endpoints**
   Use the debug component in the frontend or curl commands above

4. **Check Browser Console**
   Open browser dev tools and look for:
   - Network requests
   - JavaScript errors
   - API response details

5. **Verify User Authentication**
   Check if user is properly logged in and has valid token

6. **Check Database Content**
   Verify tables exist and contain data:
   ```sql
   SHOW TABLES;
   SELECT COUNT(*) FROM waste_collection;
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM companies;
   ```

## 🎯 **Expected Behavior**

After fixing the issue, you should see:
- ✅ Backend server running without errors
- ✅ Database connection successful
- ✅ API endpoints responding correctly
- ✅ Frontend loading waste collections data
- ✅ Beautiful UI displaying collections with statistics

## 📞 **If Issues Persist**

1. Check the browser console for detailed error messages
2. Check the backend server console for error logs
3. Use the debug component to identify specific failing endpoints
4. Verify all environment variables are set correctly
5. Ensure all dependencies are installed: `npm install`

## 🔄 **Reset Everything (Nuclear Option)**

If all else fails:
```bash
# Backend
cd ecotunga_backend
rm -rf node_modules package-lock.json
npm install
npx knex migrate:rollback --all
npx knex migrate:latest
npm start

# Frontend
cd ecotunga_frontend
rm -rf node_modules package-lock.json
npm install
npm start
``` 