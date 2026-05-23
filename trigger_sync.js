const http = require('http');

function callControlPlane(path) {
  return new Promise((resolve) => {
    const req = http.get({
      host: '127.0.0.1',
      port: 8000,
      path: path,
      headers: { 'Authorization': 'Bearer local_dev_bypass' },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', (err) => resolve({ status: 500, error: err.message }));
  });
}

async function run() {
  console.log("Triggering /sync...");
  const resSync = await callControlPlane('/sync');
  console.log("Sync Response Status:", resSync.status);
  console.log("Sync Response Data:", resSync.data);

  console.log("\nTriggering /files...");
  const resFiles = await callControlPlane('/files');
  console.log("Files Response Status:", resFiles.status);
  console.log("Files Response Data length:", resFiles.data ? resFiles.data.length : 0);
  if (resFiles.data && resFiles.data.length > 0) {
    try {
      const parsed = JSON.parse(resFiles.data);
      console.log("Files keys/structure:", Object.keys(parsed).slice(0, 10));
      if (Array.isArray(parsed)) {
        console.log("Files listing:", parsed.slice(0, 30));
      } else {
        console.log("Files listing (keys):", Object.keys(parsed).slice(0, 30));
      }
    } catch(e) {
      console.log("Files plain text snippet:", resFiles.data.slice(0, 500));
    }
  }
}

run();
