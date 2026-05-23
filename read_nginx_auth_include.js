const fs = require('fs');
try {
  console.log(fs.readFileSync('/etc/nginx/nginx_auth.conf.include', 'utf8'));
} catch(e) {
  console.error(e.message);
}
