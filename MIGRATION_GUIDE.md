# MySQL to Supabase PostgreSQL Migration Guide

## Overview
Your application has been successfully migrated from XAMPP MySQL to Supabase PostgreSQL. All database connections, queries, and configurations have been updated.

## Changes Made

### 1. Dependencies Updated
- ✅ Removed: `mysql2` (MySQL driver)
- ✅ Added: `@supabase/supabase-js` (Supabase client library)

**What to do:**
```bash
cd backend
npm install
```

### 2. Database Configuration (`backend/src/config/database.js`)
- ✅ Replaced MySQL connection pool with Supabase client
- ✅ Now uses environment variables: `SUPABASE_URL` and `SUPABASE_KEY`
- ✅ Automatic connection testing on startup

### 3. Environment Variables (`backend/.env.example`)
**Old variables (REMOVED):**
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=cv
```

**New variables (REQUIRED):**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

### 4. All Routes Updated

#### Query Changes Overview:
- ✅ `backend/src/routes/profile.js` - Simple SELECT converted to Supabase API
- ✅ `backend/src/routes/skills.js` - Filtered queries now use Supabase filters
- ✅ `backend/src/routes/experience.js` - JSON field handling updated
- ✅ `backend/src/routes/blog.js` - JSONB parsing for PostgreSQL
- ✅ `backend/src/routes/projects.js` - Complex JOINs refactored for Supabase
- ✅ `backend/src/routes/certifications.js` - Simple ordering queries updated
- ✅ `backend/src/routes/testimonials.js` - Filter queries updated
- ✅ `backend/src/routes/contact.js` - INSERT queries updated for Supabase

#### Key Technical Changes:

**MySQL Query (OLD):**
```javascript
const [rows] = await pool.query('SELECT * FROM profile LIMIT 1');
```

**Supabase Query (NEW):**
```javascript
const { data, error } = await supabase
  .from('profile')
  .select('*')
  .limit(1)
  .single();
```

**MySQL with WHERE (OLD):**
```javascript
const [rows] = await pool.query('SELECT * FROM skills WHERE category = ?', [category]);
```

**Supabase with Filters (NEW):**
```javascript
const { data, error } = await supabase
  .from('skills')
  .select('*')
  .eq('category', category)
  .order('sort_order');
```

### 5. PostgreSQL-Specific Features Used
- ✅ **JSONB Support**: Blog tags, experience achievements/technologies now use native JSONB
- ✅ **Nested Queries**: Projects route uses Supabase nested selects instead of GROUP_CONCAT
- ✅ **UUID Support**: Database schema includes UUID support via `uuid-ossp` extension

## Setup Instructions

### Step 1: Set Up Supabase Credentials
1. Go to your Supabase project dashboard: https://app.supabase.com
2. Find your project URL under "Project Settings" → "General" (e.g., `https://ulgcfvvtxqzpodlzpdth.supabase.co`)
3. Find your Anon Key under "Project Settings" → "API"
4. Create `.env` file in `backend/` directory:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key-here
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_TO=your-email@gmail.com
   ```

### Step 2: Migrate Your Database Schema
1. In Supabase Dashboard, go to "SQL Editor"
2. Create a new query and run the PostgreSQL schema provided in your project
3. The schema file includes all table definitions with proper PostgreSQL syntax

### Step 3: Migrate Your Data
1. Export data from your MySQL database using a tool like:
   - **MySQL Workbench**: Database → Export Data
   - **phpMyAdmin**: Export feature
   - **mysqldump**: `mysqldump -u root cv > backup.sql`

2. Transform and import to Supabase:
   - Use Supabase's CSV import feature for simple tables
   - Or manually insert data using Supabase Studio
   - Or write a migration script if you have complex data relationships

### Step 4: Install Dependencies
```bash
cd backend
npm install
```

### Step 5: Start the Backend
```bash
npm run dev
```

You should see:
```
✅ Supabase PostgreSQL connected
🚀 Backend API running on http://localhost:5000
```

## Data Type Mapping Reference

### MySQL → PostgreSQL
| MySQL | PostgreSQL | Notes |
|-------|-----------|-------|
| INT | INTEGER | Auto-increment works the same |
| VARCHAR | VARCHAR | Same |
| TEXT | TEXT | Same |
| JSON | JSONB | More efficient with indexes |
| TIMESTAMP | TIMESTAMP | Same (with timezone awareness) |
| BOOLEAN | BOOLEAN | MySQL uses TINYINT(1) |
| DATETIME | TIMESTAMP | Different handling of timezone |

## Testing

### Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-07-15T..."
}
```

### Test API Endpoints
```bash
# Get profile
curl http://localhost:5000/api/profile

# Get skills
curl http://localhost:5000/api/skills

# Get projects
curl http://localhost:5000/api/projects

# Get blog posts
curl http://localhost:5000/api/blog
```

## Troubleshooting

### Error: "Missing Supabase credentials"
**Solution:** Make sure your `.env` file has:
- `SUPABASE_URL` set to your project URL
- `SUPABASE_KEY` set to your anon key

### Error: "Supabase connection failed"
**Possible causes:**
- Wrong credentials
- Network connectivity issue
- Supabase service down
- Tables don't exist in the database

**Solution:**
1. Verify credentials in Supabase dashboard
2. Check network connectivity
3. Verify schema was imported correctly
4. Check Supabase status at https://status.supabase.com

### Queries returning empty results
**Possible causes:**
- Data hasn't been migrated from MySQL to Supabase
- Table names have different case sensitivity in PostgreSQL

**Solution:**
1. Check that data exists in Supabase Studio
2. Verify table names are lowercase (PostgreSQL is case-sensitive for quoted identifiers)
3. Import your data from MySQL backup

### CORS Errors
**Solution:** Make sure `CORS_ORIGIN` in `.env` matches your frontend URL:
```
CORS_ORIGIN=http://localhost:3000  # for local development
CORS_ORIGIN=https://yourdomain.com  # for production
```

## Frontend Configuration (if applicable)

Your frontend already has a Supabase configuration file at the root:
- File: `supabase.js`
- Contains: `SUPABASE_URL` and `SUPABASE_ANON_KEY`

These are used for direct Supabase client-side connections (not for the backend API).

## Important Notes

1. **Row Level Security (RLS)**: Supabase uses RLS for security. Your backend uses the anon key, so configure RLS policies accordingly or disable for read-only access.

2. **Real-time Features**: Supabase offers real-time subscriptions if you want to add live updates (not currently used in this app).

3. **Backups**: Supabase automatically backs up your data. You can also export at any time via the dashboard.

4. **Connection Limits**: Supabase has connection limits based on your plan. The application uses single client instance for all queries.

## Performance Improvements with PostgreSQL

1. **Better JSON handling**: JSONB is indexed and queryable
2. **Advanced filtering**: PostgreSQL has more powerful query capabilities
3. **Better scaling**: PostgreSQL handles concurrent connections better
4. **Full-text search**: Available if needed in future
5. **Transactions**: Better support for multi-table operations

## Next Steps (Optional Enhancements)

1. **Enable Row Level Security** in Supabase for production
2. **Set up automated backups** 
3. **Configure custom domain** for your Supabase instance
4. **Add monitoring** using Supabase logs
5. **Implement caching** with Redis for frequently accessed data

## Support

- **Supabase Documentation**: https://supabase.com/docs
- **Supabase Community**: https://github.com/supabase/supabase/discussions
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

**Migration completed successfully!** Your application is now running on Supabase PostgreSQL. 🎉
