# Debug Steps for Waste Collections Loading Issue

## Quick Fixes:

1. **Start Backend Server:**
   ```bash
   cd ecotunga_backend
   npm start
   ```

2. **Check Database:**
   ```bash
   npx knex migrate:latest
   ```

3. **Test API:**
   ```bash
   curl http://localhost:5001/api/test
   curl http://localhost:5001/api/waste-collections/test
   ```

4. **Check .env file has:**
   - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
   - JWT_SECRET

5. **Clear browser storage:**
   - Open dev tools → Application → Storage → Clear

6. **Use debug component in frontend** to test endpoints

## Common Issues:
- Database not running
- Wrong database credentials
- Missing JWT token
- CORS issues
- Tables not migrated 