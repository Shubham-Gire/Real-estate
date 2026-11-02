import { execSync } from 'child_process';

const out = execSync('"C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe" -U postgres -h localhost -p 5432 -d realestate_db -c "SELECT id, title, price, city, owner_id FROM properties LIMIT 5;"', {
  env: { ...process.env, PGPASSWORD: 'root' },
  encoding: 'utf-8'
});
console.log('Sample properties:\n', out);
