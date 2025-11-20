export const tournaments = [
  {
    id: 1,
    name: "Torneo Empresarial CDMX",
    location: "Club de Golf Chapultepec",
    state: "CDMX",
    date: "2025-07-15",
    status: "activo",
    worker: "Juan Pérez",
    cameras: ["CS1", "CS2"],
    holes: [7, 12, 16],
  },
  {
    id: 2,
    name: "Copa Guadalajara Open",
    location: "Atlas Country Club",
    state: "Jalisco",
    date: "2025-07-20",
    status: "pendiente",
    worker: "María González",
    cameras: ["CS3", "CS4"],
    holes: [3, 9, 18],
  },
  {
    id: 3,
    name: "Torneo Monterrey Elite",
    location: "La Herradura Golf Club",
    state: "Nuevo León",
    date: "2025-07-10",
    status: "terminado",
    worker: "Carlos Rodríguez",
    cameras: ["CS5", "CS6"],
    holes: [5, 11, 17],
  },
];

export const workers = [
  {
    id: 1,
    name: "Juan Pérez",
    state: "CDMX",
    status: "activo",
    phone: "55-1234-5678",
    email: "juan@pxgolf.com",
    camerasAssigned: [], // ← NUEVA PROPIEDAD
  },
  {
    id: 2,
    name: "María González",
    state: "Jalisco",
    status: "disponible",
    phone: "33-8765-4321",
    email: "maria@pxgolf.com",
    camerasAssigned: [], // ← NUEVA PROPIEDAD
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    state: "Nuevo León",
    status: "disponible",
    phone: "81-5555-1234",
    email: "carlos@pxgolf.com",
    camerasAssigned: [], // ← NUEVA PROPIEDAD
  },
  {
    id: 4,
    name: "Ana Martínez",
    state: "Yucatán",
    status: "activo",
    phone: "999-123-4567",
    email: "ana@pxgolf.com",
    camerasAssigned: [], // ← NUEVA PROPIEDAD
  },
  {
    id: 5,
    name: "Roberto Silva",
    state: "Baja California",
    status: "disponible",
    phone: "664-987-6543",
    email: "roberto@pxgolf.com",
    camerasAssigned: [], // ← NUEVA PROPIEDAD
  },
  {
    id: 6,
    name: "Laura Hernández",
    state: "CDMX",
    status: "disponible",
    phone: "55-4321-8765",
    email: "laura@pxgolf.com",
    camerasAssigned: [], // ← NUEVA PROPIEDAD
  },
  {
    id: 7,
    name: "Miguel Torres",
    state: "Jalisco", 
    status: "disponible",
    phone: "33-1234-5678",
    email: "miguel@pxgolf.com",
    camerasAssigned: [], // ← NUEVA PROPIEDAD
  },
  {
    id: 8,
    name: "Sofia Castro",
    state: "Quintana Roo",
    status: "disponible",
    phone: "998-765-4321",
    email: "sofia@pxgolf.com",
    camerasAssigned: [], // ← NUEVA PROPIEDAD
  },
];

export const cameras = [
  {
    id: "CS1",
    model: "Hikvision DS-2XS6A25G0-I/CH20S40",
    type: "Solar",
    status: "en uso",
    location: "CDMX",
  },
  {
    id: "CS2",
    model: "Hikvision DS-2XS6A25G0-I/CH20S40",
    type: "Solar",
    status: "en uso",
    location: "CDMX",
  },
  {
    id: "CS3",
    model: "Hikvision DS-2XS6825G0-I/CH20S40",
    type: "Solar",
    status: "disponible",
    location: "Jalisco",
  },
  {
    id: "CS4",
    model: "Hikvision DS-2XS6825G0-I/CH20S40",
    type: "Solar",
    status: "disponible",
    location: "Jalisco",
  },
  {
    id: "CS5",
    model: "Hikvision DS-2XS6A25G0-I/CH20S40",
    type: "Solar",
    status: "disponible",
    location: "Nuevo León",
  },
  {
    id: "CS6",
    model: "Hikvision DS-2XS6825G0-I/CH20S40",
    type: "Solar",
    status: "disponible",
    location: "Nuevo León",
  },
  {
    id: "CS7",
    model: "Hikvision DS-2XS6A25G0-I/CH20S40",
    type: "Solar",
    status: "mantenimiento",
    location: "Almacén",
  },
  {
    id: "CS8",
    model: "Hikvision DS-2XS6825G0-I/CH20S40",
    type: "Solar",
    status: "disponible",
    location: "Almacén",
  },
  {
    id: "CS9",
    model: "Hikvision DS-2XS6A25G0-I/CH20S40",
    type: "Solar",
    status: "disponible",
    location: "Almacén",
  },
  {
    id: "CS10",
    model: "Hikvision DS-2XS6825G0-I/CH20S40",
    type: "Solar",
    status: "disponible",
    location: "Almacén",
  },
  {
    id: "CS11",
    model: "Hikvision DS-2XS6A25G0-I/CH20S40",
    type: "Solar",
    status: "disponible",
    location: "Almacén",
  },
  {
    id: "CS12",
    model: "Hikvision DS-2XS6825G0-I/CH20S40",
    type: "Solar",
    status: "disponible",
    location: "Almacén",
  },
];

export const shipments = [
  {
    id: "ENV-001",
    cameras: ["CS7", "CS8"],
    destination: "Cancún, Quintana Roo",
    recipient: "Luis Hernández",
    sender: "Almacén Central",
    date: "2025-07-09",
    status: "enviado",
  },
  {
    id: "ENV-002",
    cameras: ["CS9", "CS10"],
    destination: "Tijuana, Baja California",
    recipient: "Roberto Silva",
    sender: "Almacén Central",
    date: "2025-07-11",
    status: "pendiente",
  },
];
// Tareas del sistema
export const tasks = [
  {
    id: 1,
    type: "camera_shipment",
    title: "Envío de cámaras urgente",
    description: "Juan Pérez necesita 4 cámaras para Torneo Empresarial CDMX",
    assignedTo: "Juan Pérez",
    tournamentId: 1,
    workerId: 1,
    state: "CDMX",
    camerasNeeded: 4,
    priority: "alta",
    dueDate: "2024-01-17",
    status: "pendiente",
    createdAt: "2024-01-15T10:00:00Z",
  },
];
