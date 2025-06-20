# ChatLure Production Setup Guide

## 🚀 Production-Ready Features

This ChatLure application now includes:

- ✅ **Real SQLite Database** with proper schema
- ✅ **Production API Routes** for all operations
- ✅ **No Mock Data** - everything uses real database
- ✅ **Type-Safe APIs** with proper error handling
- ✅ **Database Seeding** for initial setup
- ✅ **Real-time Analytics** tracking
- ✅ **Credential Management** with secure storage
- ✅ **User Management** system
- ✅ **Story Management** with full CRUD operations

## 📁 Database Structure

The SQLite database (`chatlure.db`) contains these tables:

- **stories** - All story data with characters and plot points
- **characters** - Story characters with relationships
- **plotPoints** - Message timeline for stories
- **users** - User accounts and subscription data
- **apiCredentials** - Secure API credential storage
- **analytics** - Performance metrics and tracking

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Seed the Database

```bash
npm run seed
```

### 3. Start Development

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## 📊 API Endpoints

All API routes are now fully functional:

### Stories

- `GET /api/stories` - Get all stories
- `GET /api/stories/:id` - Get single story
- `POST /api/stories` - Create new story
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user activity

### Credentials

- `GET /api/credentials` - Get all API credentials
- `PUT /api/credentials/:service` - Update service credentials

### Analytics

- `GET /api/analytics/dashboard` - Get dashboard metrics
- `POST /api/analytics/track` - Track new metric

### Utilities

- `POST /api/seed` - Seed database with demo data
- `POST /api/test-connection/:service` - Test API connections
- `POST /api/reddit/search` - Search Reddit for content

## 🔐 Security Features

1. **Input Validation** - All API endpoints validate input data
2. **SQL Injection Protection** - Using prepared statements
3. **Error Handling** - Comprehensive error handling throughout
4. **Type Safety** - Full TypeScript coverage
5. **Credential Security** - Encrypted storage of API keys

## 📈 Admin Dashboard Features

The admin dashboard now includes:

- **Real-time Metrics** with live updates
- **User Management** with engagement tracking
- **Story Library** with full CRUD operations
- **Content Import** from Reddit (with proper API integration)
- **API Settings** with connection testing
- **Analytics Dashboard** with performance metrics
- **Billing Integration** with PayPal

## 🗄️ Database Operations

### Manual Database Access

```bash
# View database in CLI
sqlite3 chatlure.db

# Common queries
.tables                    # List all tables
SELECT * FROM stories;     # View all stories
SELECT * FROM users;       # View all users
```

### Backup Database

```bash
# Create backup
cp chatlure.db chatlure_backup_$(date +%Y%m%d).db

# Restore from backup
cp chatlure_backup_20241220.db chatlure.db
```

## 🔧 Configuration

### Environment Variables (Optional)

```bash
# For production deployments
NODE_ENV=production

# Database location (default: ./chatlure.db)
DB_PATH=/path/to/database/chatlure.db
```

### API Credentials

Configure in the admin panel at `/admin` > Settings:

1. **Reddit API** - For content import
2. **Clerk Auth** - For user authentication
3. **PayPal** - For subscription billing

## 🚀 Deployment

### Using Vercel/Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set up API routes as serverless functions
4. Upload database file to persistent storage

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Using Traditional Server

1. Build: `npm run build`
2. Serve `dist` folder with Express/Nginx
3. Set up API routes on backend server
4. Ensure database file permissions

## 🧪 Testing

```bash
# Run unit tests
npm test

# Type checking
npm run typecheck

# Format code
npm run format.fix
```

## 📝 API Usage Examples

### Creating a Story

```javascript
const response = await fetch('/api/stories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "My New Story",
    genre: "drama",
    description: "A compelling drama story",
    characters: [...],
    plotPoints: [...]
  })
});
```

### Tracking Analytics

```javascript
await fetch("/api/analytics/track", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    metric: "story_views",
    value: 1,
    metadata: { storyId: "story_123" },
  }),
});
```

## 🛠️ Maintenance

### Regular Tasks

1. **Database Backup** - Daily backups recommended
2. **Analytics Cleanup** - Archive old analytics data
3. **User Cleanup** - Remove inactive users periodically
4. **Performance Monitoring** - Monitor API response times

### Monitoring

- Check database size growth
- Monitor API endpoint performance
- Track user engagement metrics
- Monitor error rates in logs

## 📞 Support

For issues or questions:

1. Check the error logs in browser console
2. Verify database connectivity
3. Test API endpoints individually
4. Check network connectivity for external APIs

---

Your ChatLure application is now production-ready with a complete database backend, real API integration, and comprehensive admin features! 🎉
