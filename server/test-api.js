import mongoose from 'mongoose';
import app from './src/server.js';

async function runTests() {
  console.log('--- Starting API & Database Integration Tests ---');
  const PORT = 5055; // Use dedicated test port

  // Start test server on 127.0.0.1
  const testServer = await new Promise((resolve) => {
    const s = app.listen(PORT, '127.0.0.1', () => {
      console.log(`Test server running on http://127.0.0.1:${PORT}`);
      resolve(s);
    });
  });

  const baseUrl = `http://127.0.0.1:${PORT}`;

  let authCookie = null;
  let authToken = null;

  async function api(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (authCookie) {
      headers['Cookie'] = authCookie;
    }
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
    });
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      authCookie = setCookie.split(';')[0];
    }
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  }

  try {
    // Wait for DB to be fully connected
    console.log('Waiting for database connection...');
    let waited = 0;
    while (mongoose.connection.readyState !== 1 && waited < 15000) {
      await new Promise((r) => setTimeout(r, 250));
      waited += 250;
    }
    console.log(`Database ready (state: ${mongoose.connection.readyState})`);

    // 1. Health Check
    console.log('\n1. Testing Health Endpoint:');
    const health = await api('/api/health');
    console.log('Status:', health.status, 'Body:', health.data?.message);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Register New User
    console.log('\n2. Testing Registration:');
    const email = `testuser_${Date.now()}@example.com`;
    const regRes = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Alex Developer',
        email,
        password: 'Password123!',
      }),
    });
    console.log('Status:', regRes.status, 'User registered:', regRes.data?.data?.user?.email);
    if (regRes.status !== 201) throw new Error(`Registration failed: ${JSON.stringify(regRes.data)}`);
    authToken = regRes.data?.data?.token;

    // 3. Duplicate Registration Test
    console.log('\n3. Testing Duplicate Registration Rejection:');
    const dupRes = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Alex Duplicate',
        email,
        password: 'Password123!',
      }),
    });
    console.log('Status:', dupRes.status, 'Error message:', dupRes.data?.message);
    if (dupRes.status !== 400) throw new Error('Duplicate email registration should fail with 400');

    // 4. Test Login
    console.log('\n4. Testing Login:');
    const loginRes = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password: 'Password123!',
      }),
    });
    console.log('Status:', loginRes.status, 'Signed in:', loginRes.data?.data?.user?.name);
    if (loginRes.status !== 200) throw new Error('Login failed');

    // 5. Test Invalid Credentials
    console.log('\n5. Testing Invalid Credentials:');
    const invalidLogin = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password: 'WrongPassword!',
      }),
    });
    console.log('Status:', invalidLogin.status, 'Message:', invalidLogin.data?.message);
    if (invalidLogin.status !== 401) throw new Error('Invalid credentials should return 401');

    // 6. Test /api/auth/me
    console.log('\n6. Testing /api/auth/me (Protected Route):');
    const meRes = await api('/api/auth/me');
    console.log('Status:', meRes.status, 'Current user:', meRes.data?.data?.user?.email);
    if (meRes.status !== 200) throw new Error('Protected route /api/auth/me failed');

    // 7. Create Tasks
    console.log('\n7. Testing Task Creation:');
    const today = new Date().toISOString().slice(0, 10);
    const task1 = await api('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Review MongoDB compound indexes',
        description: 'Verify query execution plans on { userId: 1, dueDate: 1 }',
        priority: 'High',
        category: 'Development',
        dueDate: today,
      }),
    });
    console.log('Status:', task1.status, 'Created task:', task1.data?.data?.title);
    if (task1.status !== 201) throw new Error('Task creation failed');
    const taskId = task1.data?.data?._id;

    // Create a completed task as well for analytics
    const task2 = await api('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Setup Express auth routes',
        description: 'Implement JWT cookies and password hashing',
        priority: 'Medium',
        category: 'Development',
        dueDate: today,
        status: 'completed',
      }),
    });
    console.log('Status:', task2.status, 'Created completed task:', task2.data?.data?.title);

    // 8. Fetch Tasks
    console.log('\n8. Testing Fetch Tasks:');
    const listRes = await api('/api/tasks');
    console.log('Status:', listRes.status, 'Count:', listRes.data?.count);
    if (listRes.status !== 200 || listRes.data?.count !== 2) throw new Error('Fetch tasks failed');

    // 9. Update Task
    console.log('\n9. Testing Update Task:');
    const updateRes = await api(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: 'Review MongoDB compound indexes (Updated)',
        priority: 'High',
      }),
    });
    console.log('Status:', updateRes.status, 'Updated title:', updateRes.data?.data?.title);
    if (updateRes.status !== 200) throw new Error('Task update failed');

    // 10. Toggle Task Status
    console.log('\n10. Testing PATCH Task Status:');
    const toggleRes = await api(`/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'completed' }),
    });
    console.log('Status:', toggleRes.status, 'New status:', toggleRes.data?.data?.status);
    if (toggleRes.status !== 200 || toggleRes.data?.data?.status !== 'completed') {
      throw new Error('Status toggle failed');
    }

    // 11. Test Analytics APIs
    console.log('\n11. Testing Analytics Overview:');
    const overview = await api('/api/analytics/overview');
    console.log('Overview:', overview.data?.data);
    if (overview.status !== 200 || overview.data?.data?.completed !== 2) {
      throw new Error('Analytics overview failed');
    }

    console.log('\n12. Testing Weekly Analytics:');
    const weekly = await api('/api/analytics/weekly');
    console.log('Weekly data points count:', weekly.data?.data?.length);
    if (weekly.status !== 200 || !weekly.data?.data?.length) {
      throw new Error('Weekly analytics failed');
    }

    console.log('\n13. Testing Priority Analytics:');
    const priority = await api('/api/analytics/priority');
    console.log('Priority breakdown:', priority.data?.data);
    if (priority.status !== 200) throw new Error('Priority analytics failed');

    // 12. Delete Task
    console.log('\n14. Testing Delete Task:');
    const delRes = await api(`/api/tasks/${taskId}`, { method: 'DELETE' });
    console.log('Status:', delRes.status, 'Deleted:', delRes.data?.data?.id);
    if (delRes.status !== 200) throw new Error('Task deletion failed');

    // 13. Logout
    console.log('\n15. Testing Logout:');
    const logoutRes = await api('/api/auth/logout', { method: 'POST' });
    console.log('Status:', logoutRes.status, 'Message:', logoutRes.data?.message);
    if (logoutRes.status !== 200) throw new Error('Logout failed');

    console.log('\n🎉 ALL BACKEND API & DATABASE INTEGRATION TESTS PASSED!');
  } catch (err) {
    console.error('\n❌ Test Failure:', err.message);
    process.exitCode = 1;
  } finally {
    testServer.close();
    await mongoose.disconnect();
    process.exit(process.exitCode || 0);
  }
}

runTests();
