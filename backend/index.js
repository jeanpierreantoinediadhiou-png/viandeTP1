const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// =============== MIDDLEWARES ===============
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://192.168.1.152:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(express.json());

// =============== LOGS ===============
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method.toUpperCase();
  const path = req.path;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`\n[${timestamp}] ${method} ${path}`);
  console.log(`   🔗 IP: ${ip}`);
  
  // Log du body pour les POST/PUT
  if ((method === 'POST' || method === 'PUT') && Object.keys(req.body).length > 0) {
    console.log(`   📦 Body:`, JSON.stringify(req.body, null, 2));
  }
  
  // Intercepter la réponse
  const originalJson = res.json;
  res.json = function(data) {
    console.log(`   ✅ Response (${res.statusCode}):`, JSON.stringify(data, null, 2));
    return originalJson.call(this, data);
  };
  
  next();
});

// =============== ROUTES DE DIAGNOSTIC ===============
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Connexion au backend établie avec succès !',
    backend_url: `http://localhost:${PORT}`,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    healthy: true,
    port: PORT,
    uptime: process.uptime()
  });
});

// Simulation d'une base de données
const users = [
  { 
    email: 'jeanpierreantoinediadhiou@gmail.com', 
    password: 'antoine256', 
    role: 'admin', 
    nom: 'Antoine Diadhiou' 
  }
];

let products = [
  { id: 1, nom: "Côte de Bœuf", prix: 12500, categorie: "Boeuf", stock: 15, image: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400", description: "Côte de bœuf premium" },
  { id: 2, nom: "Poulet Fermier", prix: 5000, categorie: "Volaille", stock: 20, image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400", description: "Poulet fermier entier" },
  { id: 3, nom: "Saucisses de Porc", prix: 3500, categorie: "Porc", stock: 10, image: "https://images.unsplash.com/photo-1518977676601-b53f82baa6f8?w=400", description: "Saucisses fraîches de porc" },
  { id: 4, nom: "Filet Mignon", prix: 18000, categorie: "Boeuf", stock: 8, image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400", description: "Filet mignon tendre" },
  { id: 5, nom: "Gigot d'Agneau", prix: 15000, categorie: "Agneau", stock: 12, image: "https://images.unsplash.com/photo-1625944525533-473f1e635245?w=400", description: "Gigot d'agneau frais" },
  { id: 6, nom: "Viande Hachée", prix: 4000, categorie: "hache", stock: 25, image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400", description: "Viande hachée 80% maigre" }
];

let orders = [
  { id: "ORD-001", client: "Jean Dupont", total: 17500, statut: "EN_ATTENTE", date: new Date().toISOString(), produits: ["Côte de Bœuf", "Poulet Fermier"] },
  { id: "ORD-002", client: "Marie Curie", total: 12500, statut: "CONFIRMEE", date: new Date().toISOString(), produits: ["Côte de Bœuf"] },
  { id: "ORD-003", client: "Pierre Martin", total: 8500, statut: "EN_ATTENTE", date: new Date(Date.now() - 86400000).toISOString(), produits: ["Saucisses de Porc", "Viande Hachée"] },
  { id: "ORD-004", client: "Sophie Laurent", total: 18000, statut: "ANNULEE", date: new Date(Date.now() - 172800000).toISOString(), produits: ["Filet Mignon"] },
  { id: "ORD-005", client: "Lucas Dubois", total: 15000, statut: "CONFIRMEE", date: new Date(Date.now() - 259200000).toISOString(), produits: ["Gigot d'Agneau"] },
];

// --- API PRODUITS ---
app.get('/api/products', (req, res) => res.json(products));

app.post('/api/products', (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { prix, stock, ...rest } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Le prix est requis pour la mise à jour." });
  }

  let updatedPrix;
  if (prix !== undefined) {
    updatedPrix = Number(prix);
    if (!Number.isFinite(updatedPrix) || updatedPrix <= 0) {
      return res.status(400).json({ message: "Le prix doit être un nombre positif." });
    }
  }

  let updatedStock;
  if (stock !== undefined) {
    updatedStock = Number(stock);
    if (!Number.isFinite(updatedStock) || updatedStock < 0) {
      return res.status(400).json({ message: "Le stock ne peut pas être négatif." });
    }
  }

  const productIndex = products.findIndex(p => p.id == id);
  if (productIndex === -1) {
    return res.status(404).json({ message: "Produit non trouvé." });
  }

  products[productIndex] = {
    ...products[productIndex],
    ...rest,
    ...(prix !== undefined && { prix: updatedPrix }),
    ...(stock !== undefined && { stock: updatedStock }),
  };

  res.json({ message: "Produit mis à jour", product: products[productIndex] });
});

app.delete('/api/products/:id', (req, res) => {
  products = products.filter(p => p.id != req.params.id);
  res.json({ message: "Produit supprimé" });
});

// --- API COMMANDES ---
app.get('/api/orders', (req, res) => res.json(orders));

const updateOrderStatus = (id, newStatut) => {
  const order = orders.find(o => o.id === id);
  if (!order) return { error: "Commande non trouvée" };

  if (newStatut === 'CONFIRMEE' && order.statut === 'ANNULEE') {
    return { error: "Impossible de confirmer une commande déjà annulée." };
  }
  if (newStatut === 'ANNULEE' && order.statut === 'CONFIRMEE') {
    return { error: "Impossible d'annuler une commande déjà confirmée." };
  }

  order.statut = newStatut;
  return { success: true };
};

app.patch('/api/orders/:id/confirm', (req, res) => {
  const result = updateOrderStatus(req.params.id, 'CONFIRMEE');
  if (result.error) return res.status(400).json({ message: result.error });
  res.json({ message: "Commande confirmée" });
});

app.patch('/api/orders/:id/cancel', (req, res) => {
  const result = updateOrderStatus(req.params.id, 'ANNULEE');
  if (result.error) return res.status(400).json({ message: result.error });
  res.json({ message: "Commande annulée" });
});

// --- BULK ACTIONS ---
app.patch('/api/orders/bulk-confirm', (req, res) => {
  const { ids } = req.body;
  const results = ids.map(id => ({ id, ...updateOrderStatus(id, 'CONFIRMEE') }));
  const successCount = results.filter(r => r.success).length;
  res.json({ 
    message: `${successCount} commandes confirmées`, 
    details: results 
  });
});

app.patch('/api/orders/bulk-cancel', (req, res) => {
  const { ids } = req.body;
  const results = ids.map(id => ({ id, ...updateOrderStatus(id, 'ANNULEE') }));
  const successCount = results.filter(r => r.success).length;
  res.json({ 
    message: `${successCount} commandes annulées`, 
    details: results 
  });
});

// Route d'inscription
app.post('/api/register', (req, res) => {
  const { nom, email, password, role } = req.body;
  
  // Validation stricte
  if (!email || !password || !nom) {
    return res.status(400).json({ message: "Email, mot de passe et nom sont requis." });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
  }
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "Cet utilisateur existe déjà." });
  }
  
  const newUser = { nom, email, password, role: role || 'user' };
  users.push(newUser);
  
  console.log(`✓ Nouvel utilisateur inscrit: ${email}`);
  res.status(201).json({ 
    message: "Compte créé avec succès !", 
    user: { nom, email, role: newUser.role } 
  });
});

// Route de connexion
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validation stricte
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    console.log(`✓ Connexion réussie: ${email} (${user.role})`);
    res.json({ 
      message: "Connexion réussie", 
      user: { nom: user.nom, email: user.email, role: user.role } 
    });
  } else {
    console.log(`✗ Tentative de connexion échouée: ${email}`);
    res.status(401).json({ message: "Email ou mot de passe incorrect." });
  }
});

// Route de déconnexion (pour le futur)
app.post('/api/logout', (req, res) => {
  res.json({ message: "Déconnecté avec succès" });
});

// =============== ROUTE RACINE ===============
app.get('/', (req, res) => {
  res.send('Serveur Viande-TP1 opérationnel !');
});

// =============== GESTION D'ERREURS GLOBALE ===============
app.use((err, req, res, next) => {
  console.error('Erreur:', err.message);
  res.status(500).json({ message: 'Erreur serveur interne', error: err.message });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// =============== DÉMARRAGE DU SERVEUR ===============
const server = app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║   SERVEUR VIANDE-TP1 DÉMARRÉ        ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║ 🚀 URL: http://localhost:${PORT.toString().padEnd(24)}║`);
  console.log(`║ 📡 CORS activé pour: localhost:8080   ║`);
  console.log('║ 📝 Routes disponibles:                ║');
  console.log('║    GET  /api/test                     ║');
  console.log('║    GET  /api/health                   ║');
  console.log('║    POST /api/login                    ║');
  console.log('║    POST /api/register                 ║');
  console.log('║    GET  /api/products                 ║');
  console.log('║    PUT  /api/products/:id             ║');
  console.log('║    GET  /api/orders                   ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
});

// Gestion des signaux d'arrêt
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt du serveur...');
  server.close(() => {
    console.log('Serveur fermé');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT reçu, arrêt du serveur...');
  server.close(() => {
    console.log('Serveur fermé');
    process.exit(0);
  });
});
