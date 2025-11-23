# Flora E-Commerce Database

This directory contains the database schema and sample data for the Flora E-Commerce application.

## Files

### schema.sql
Complete database schema with all tables, indexes, and foreign keys.

**Usage:**
```bash
mysql -u root -p < schema.sql
```

This creates:
- All database tables
- Indexes for performance
- Foreign key constraints
- Complete production-ready structure

### seeder.sql
Sample data for development and testing.

**Usage:**
```bash
mysql -u root -p < seeder.sql
```

This inserts:
- Default roles (GUEST, USER, ADMIN)
- Admin user (admin/password123)
- Test users
- Sample categories
- Sample products

## Quick Setup

1. **Create database and schema:**
   ```bash
   mysql -u root -p < schema.sql
   ```

2. **Load sample data (optional for development):**
   ```bash
   mysql -u root -p < seeder.sql
   ```

## Default Credentials

**Admin Account:**
- Username: `admin`
- Email: `admin@flora.com`
- Password: `password123`

**Test User:**
- Username: `john_doe`
- Email: `john@example.com`
- Password: `password123`

## Notes

- Run `schema.sql` first to create the database structure
- `seeder.sql` is optional and only for development/testing
- For production, skip `seeder.sql` and create your own admin user
- All passwords in seeder are bcrypt hashed
