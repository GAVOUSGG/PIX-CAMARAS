


const API_BASE = 'http://127.0.0.1:3001';

const reproduceBug = async () => {
  try {
    console.log('🐞 Starting reproduction script...');

    // 1. Create two cameras
    const cam1 = { id: 'BUG-CAM-1', model: 'Test 1', status: 'disponible' };
    const cam2 = { id: 'BUG-CAM-2', model: 'Test 2', status: 'disponible' };

    await fetch(`${API_BASE}/cameras`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cam1) });
    await fetch(`${API_BASE}/cameras`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cam2) });

    // 2. Create history for both
    const hist1 = { id: 'HIST-1', cameraId: 'BUG-CAM-1', title: 'Event 1', date: new Date().toISOString() };
    const hist2 = { id: 'HIST-2', cameraId: 'BUG-CAM-2', title: 'Event 2', date: new Date().toISOString() };

    await fetch(`${API_BASE}/cameraHistory`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(hist1) });
    await fetch(`${API_BASE}/cameraHistory`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(hist2) });

    // 3. Test GET with valid ID
    console.log('Testing GET /cameraHistory?cameraId=BUG-CAM-1');
    const res1 = await fetch(`${API_BASE}/cameraHistory?cameraId=BUG-CAM-1`);
    const data1 = await res1.json();
    console.log(`Returned ${data1.length} entries. (Expected 1)`);
    if (data1.length !== 1) console.error('❌ FILTERING FAILED for valid ID!');

    // 4. Test GET with empty ID
    console.log('Testing GET /cameraHistory?cameraId=');
    const res2 = await fetch(`${API_BASE}/cameraHistory?cameraId=`);
    const data2 = await res2.json();
    console.log(`Returned ${data2.length} entries. (If > 1, this is the risk)`);
    
    // Cleanup
    await fetch(`${API_BASE}/cameras/BUG-CAM-1`, { method: 'DELETE' });
    await fetch(`${API_BASE}/cameras/BUG-CAM-2`, { method: 'DELETE' });
    await fetch(`${API_BASE}/cameraHistory/HIST-1`, { method: 'DELETE' });
    await fetch(`${API_BASE}/cameraHistory/HIST-2`, { method: 'DELETE' });

  } catch (error) {
    console.error('Error:', error);
  }
};

reproduceBug();

