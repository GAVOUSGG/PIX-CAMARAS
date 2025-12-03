

const API_BASE = 'http://127.0.0.1:3001';

const testApi = async () => {
  try {
    console.log('Testing API...');

    // Test GET /tournaments
    console.log('GET /tournaments');
    const resTournaments = await fetch(`${API_BASE}/tournaments`);
    if (!resTournaments.ok) throw new Error(`GET /tournaments failed: ${resTournaments.status}`);
    const tournaments = await resTournaments.json();
    console.log(`✅ Fetched ${tournaments.length} tournaments.`);

    // Test GET /workers
    console.log('GET /workers');
    const resWorkers = await fetch(`${API_BASE}/workers`);
    if (!resWorkers.ok) throw new Error(`GET /workers failed: ${resWorkers.status}`);
    const workers = await resWorkers.json();
    console.log(`✅ Fetched ${workers.length} workers.`);

    // Test POST /cameras (Create)
    console.log('POST /cameras');
    const newCamera = {
      id: `TEST-CAM-${Date.now()}`,
      model: 'Test Model',
      status: 'disponible'
    };
    const resCreate = await fetch(`${API_BASE}/cameras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCamera)
    });
    if (!resCreate.ok) throw new Error(`POST /cameras failed: ${resCreate.status}`);
    const createdCamera = await resCreate.json();
    console.log(`✅ Created camera: ${createdCamera.id}`);

    // Test DELETE /cameras (Cleanup)
    console.log(`DELETE /cameras/${createdCamera.id}`);
    const resDelete = await fetch(`${API_BASE}/cameras/${createdCamera.id}`, {
      method: 'DELETE'
    });
    if (!resDelete.ok) throw new Error(`DELETE /cameras failed: ${resDelete.status}`);
    console.log('✅ Deleted camera.');

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
};

testApi();
