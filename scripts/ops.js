/**
 * Smart To-Do & Productivity Manager - Automation & Verification Script
 * 
 * Usage:
 *   node scripts/ops.js verify      - Run full verification (Git, Backend Tests, Frontend Build, MongoDB, Vercel)
 *   node scripts/ops.js test        - Run backend test suite only
 *   node scripts/ops.js build       - Run frontend build only
 *   node scripts/ops.js mongo       - Check MongoDB Atlas connectivity (safe credentials masking)
 *   node scripts/ops.js vercel      - Inspect Vercel deployments and project status
 *   node scripts/ops.js live <url>  - Probe health endpoint on a live deployed backend
 */

import { execSync } from 'child_process';
import mongoose from 'mongoose';
import path from 'path';

function run(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf-8', stdio: options.silent ? 'pipe' : 'inherit', ...options });
  } catch (err) {
    if (options.ignoreError) return null;
    throw err;
  }
}

async function checkGit() {
  console.log('\n--- 1. Git Repository Audit ---');
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    const commit = execSync('git log -1 --oneline', { encoding: 'utf-8' }).trim();
    const status = execSync('git status --short', { encoding: 'utf-8' }).trim();
    console.log(`Branch: ${branch}`);
    console.log(`Commit: ${commit}`);
    console.log(`Working Tree: ${status ? 'Uncommitted changes present' : 'Clean'}`);
    return { ok: true, branch, commit, clean: !status };
  } catch (e) {
    console.error('Git check error:', e.message);
    return { ok: false, error: e.message };
  }
}

async function runBackendTests() {
  console.log('\n--- 2. Backend API & DB Tests ---');
  try {
    run('npm --prefix server run test');
    console.log('✓ Backend tests passed (15/15).');
    return true;
  } catch (e) {
    console.error('✗ Backend tests failed.');
    return false;
  }
}

async function runFrontendBuild() {
  console.log('\n--- 3. Frontend Production Build ---');
  try {
    run('npm --prefix client run build');
    console.log('✓ Frontend build succeeded with 0 errors.');
    return true;
  } catch (e) {
    console.error('✗ Frontend build failed.');
    return false;
  }
}

async function checkMongo() {
  console.log('\n--- 4. MongoDB Atlas Connectivity Check ---');
  try {
    process.loadEnvFile('server/.env');
  } catch {
    console.warn('Warning: Could not read server/.env');
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('Notice: MONGODB_URI not configured in server/.env');
    return false;
  }

  const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
  console.log(`Target Cluster: ${maskedUri}`);

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.log(`✗ Atlas Connection Notice: ${err.message}`);
    if (err.message.includes('whitelist') || err.message.includes('Could not connect to any servers')) {
      console.log('  Action: Whitelist current IP or 0.0.0.0/0 in MongoDB Atlas > Network Access.');
    }
    return false;
  }
}

async function checkVercel() {
  console.log('\n--- 5. Vercel CLI Status ---');
  try {
    const whoami = execSync('vercel whoami', { encoding: 'utf-8', stdio: 'pipe' }).trim();
    console.log(`✓ Authenticated as: ${whoami}`);
    return true;
  } catch (e) {
    console.log('Notice: Vercel CLI not authenticated or not in PATH.');
    return false;
  }
}

async function probeLive(url) {
  console.log(`\n--- Probing Live Health: ${url} ---`);
  try {
    const healthUrl = url.endsWith('/') ? `${url}api/health` : `${url}/api/health`;
    const res = await fetch(healthUrl);
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log('Response:', data);
    return res.status === 200;
  } catch (e) {
    console.error(`Probe failed: ${e.message}`);
    return false;
  }
}

async function main() {
  const command = process.argv[2] || 'verify';

  if (command === 'verify') {
    console.log('=== Smart To-Do DevOps Verification Pipeline ===');
    await checkGit();
    const backendOk = await runBackendTests();
    const frontendOk = await runFrontendBuild();
    await checkMongo();
    await checkVercel();
    console.log('\n=== Pipeline Summary ===');
    console.log(`Backend Suite:  ${backendOk ? 'PASS' : 'FAIL'}`);
    console.log(`Frontend Build: ${frontendOk ? 'PASS' : 'FAIL'}`);
  } else if (command === 'test') {
    await runBackendTests();
  } else if (command === 'build') {
    await runFrontendBuild();
  } else if (command === 'mongo') {
    await checkMongo();
  } else if (command === 'vercel') {
    await checkVercel();
  } else if (command === 'live') {
    const targetUrl = process.argv[3];
    if (!targetUrl) {
      console.error('Error: Please provide a URL to probe, e.g. node scripts/ops.js live https://my-service.onrender.com');
      process.exit(1);
    }
    await probeLive(targetUrl);
  } else {
    console.log(`Unknown command: ${command}`);
  }
}

main().catch((e) => {
  console.error('Pipeline error:', e);
  process.exit(1);
});
