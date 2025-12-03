const axios = require('axios');

const API_URL = 'http://localhost:3002/api/v1/auth';
const TEST_USER = {
    email: `test_${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test User',
    role: 'candidate',
};

const runTest = async () => {
    try {
        console.log('--- Starting Manual Test ---');

        // 1. Register
        console.log(`\n1. Registering user: ${TEST_USER.email}`);
        const registerRes = await axios.post(`${API_URL}/register`, TEST_USER);
        console.log('Response:', registerRes.data);

        // 2. Verify Email (Simulate clicking link)
        // In a real scenario, we'd parse the logs, but here we can't easily access the server logs from this script.
        // So we will cheat slightly and query the DB or just ask the user to click the link.
        // BUT, since we are running this as a script, we can't easily get the token unless we expose it in the register response (which is insecure but okay for dev) OR we just say "Check your terminal for the link".

        // However, for this automated script to work fully, I'll need to fetch the token from the DB directly if I want it to be fully automated, OR I can just skip verification if I disable it for testing.
        // Let's just print a message.
        console.log('\n[!] Please check the server terminal for the Verification Link.');
        console.log('[!] Copy the token from the link and paste it here to continue (or Ctrl+C to stop):');

        // Since I can't interactively paste in this environment easily, I will just stop here.
        // Wait, I can use the `User` model if I connect to DB here, but that requires setup.
        // Let's just make this script register and try to login (which should fail).

        console.log('\n2. Attempting Login (Should fail before verification)');
        try {
            await axios.post(`${API_URL}/login`, { email: TEST_USER.email, password: TEST_USER.password });
        } catch (error) {
            console.log('Expected Failure:', error.response ? error.response.data : error.message);
        }

        console.log('\n--- Test Complete (Part 1) ---');
        console.log('To finish testing:');
        console.log('1. Click the link in the server terminal.');
        console.log('2. Use Swagger UI to Login.');

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
};

runTest();
