
const API_BASE = 'http://127.0.0.1:3001';

const reproduceShipmentBug = async () => {
  try {
    console.log('🐞 Starting shipment bug reproduction...');

    // 1. Create a shipment
    const shipment = {
      id: 'BUG-SHIP-1',
      destination: 'Test Dest',
      recipient: 'Test Recipient',
      status: 'enviado',
      cameras: ['CAM-1']
    };
    await fetch(`${API_BASE}/shipments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(shipment) });
    console.log('Created shipment.');

    // 2. Create history related to this shipment
    const hist1 = { id: 'HIST-S1', cameraId: 'CAM-1', type: 'shipment', details: { shipmentId: 'BUG-SHIP-1' }, date: new Date().toISOString() };
    await fetch(`${API_BASE}/cameraHistory`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(hist1) });

    // 3. Create UNRELATED history
    const hist2 = { id: 'HIST-OTHER', cameraId: 'CAM-2', type: 'maintenance', details: {}, date: new Date().toISOString() };
    await fetch(`${API_BASE}/cameraHistory`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(hist2) });
    console.log('Created related and unrelated history.');

    // 4. Verify history count
    const resBefore = await fetch(`${API_BASE}/cameraHistory`);
    const allBefore = await resBefore.json();
    console.log(`History count before: ${allBefore.length}`);

    // 5. Simulate deleteShipment logic (fetch all, filter, delete)
    // This mimics the frontend logic in useAppState.js
    const allHistory = await (await fetch(`${API_BASE}/cameraHistory`)).json();
    const shipmentHistory = allHistory.filter(
        (entry) =>
          (entry.type === "shipment" || entry.type === "return") &&
          entry.details &&
          entry.details.shipmentId === 'BUG-SHIP-1'
    );
    
    console.log(`Found ${shipmentHistory.length} history entries to delete.`);

    for (const entry of shipmentHistory) {
        console.log(`Deleting history entry: ${entry.id}`);
        await fetch(`${API_BASE}/cameraHistory/${entry.id}`, { method: 'DELETE' });
    }

    // 6. Verify history again
    const resAfter = await fetch(`${API_BASE}/cameraHistory`);
    const allAfter = await resAfter.json();
    console.log(`History count after: ${allAfter.length}`);

    const unrelatedExists = allAfter.find(h => h.id === 'HIST-OTHER');
    if (!unrelatedExists) {
        console.error('❌ BUG REPRODUCED: Unrelated history was deleted!');
    } else {
        console.log('✅ Unrelated history still exists.');
    }

    // Cleanup
    await fetch(`${API_BASE}/shipments/BUG-SHIP-1`, { method: 'DELETE' });
    if (unrelatedExists) await fetch(`${API_BASE}/cameraHistory/HIST-OTHER`, { method: 'DELETE' });

  } catch (error) {
    console.error('Error:', error);
  }
};

reproduceShipmentBug();
