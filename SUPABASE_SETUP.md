# Supabase Setup

CyberPoa can use Supabase because Supabase provides a PostgreSQL database.

## 1. Create the Supabase project

1. Create a new project in Supabase.
2. Open the `Connect` button in the Supabase dashboard.
3. Copy one of these connection strings:
   - Use the direct connection if your host supports IPv6.
   - Use the Supavisor session pooler if your host only supports IPv4.

Supabase documents these connection options here:
- https://supabase.com/docs/guides/database/connecting-to-postgres

## 2. Set CyberPoa environment variables

The app now supports `DATABASE_URL` directly.

Example:

```env
DATABASE_URL=postgres://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
DB_SSL_REQUIRE=true
APP_TIME_ZONE=Africa/Nairobi
```

Notes:
- For Render or other IPv4-only hosts, prefer the Supavisor session pooler string from Supabase.
- Keep SSL enabled for Supabase connections.

## 3. Migrate the schema into Supabase

After setting `DATABASE_URL`, run:

```powershell
python manage.py migrate
```

This creates the tables and built-in Django metadata in Supabase.

## 4. Move your data

If your current data is in SQLite:

1. Open the CyberPoa Backup page.
2. Download the JSON backup file.
3. Point the app to Supabase with `DATABASE_URL`.
4. Run `python manage.py migrate`.
5. Open the Restore page in the Supabase-connected app.
6. Upload the downloaded JSON backup.

The backup file is a portable Django fixture intended for CyberPoa restore into PostgreSQL/Supabase-backed deployments.

## 5. Verify the move

Check:
- Login still works
- Businesses, clients, transactions, expenses, and reports are present
- New records save correctly
- Backup downloads a `.json` file

## 6. Important limitation

The in-app backup is a CyberPoa JSON fixture, not a raw PostgreSQL `.sql` dump.

That means:
- It is ideal for restoring through CyberPoa after the app is connected to Supabase.
- It is not meant for direct import in the Supabase SQL editor.

If you later want raw PostgreSQL backups too, use a Postgres-native tool such as `pg_dump` against the Supabase connection string. Supabase recommends direct connections for native Postgres commands when IPv6 is available.

Supabase import docs:
- https://supabase.com/docs/guides/database/import-data
