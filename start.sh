#!/bin/bash

# Script de démarrage du projet Viande-TP1
# Utilisation: ./start.sh ou bash start.sh

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   🚀 DÉMARRAGE VIANDE-TP1                 ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
  echo "❌ Erreur: Node.js n'est pas installé"
  exit 1
fi

echo "✓ Node.js: $(node --version)"
echo "✓ npm: $(npm --version)"
echo ""

# Démarrer le backend
echo "📡 Démarrage du BACKEND sur le port 5000..."
cd backend
npm run dev &
BACKEND_PID=$!
echo "   PID: $BACKEND_PID"
cd ..

sleep 2

# Démarrer le frontend
echo ""
echo "🎨 Démarrage du FRONTEND sur le port 8080..."
cd frontend
npm run dev &
FRONTEND_PID=$!
echo "   PID: $FRONTEND_PID"
cd ..

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   ✅ PROJET DÉMARRÉ AVEC SUCCÈS           ║"
echo "╠════════════════════════════════════════════╣"
echo "║ Frontend:  http://localhost:8080           ║"
echo "║ Backend:   http://localhost:5000           ║"
echo "║ Admin:     http://localhost:8080/admin     ║"
echo "║ Test:      http://localhost:8080/test      ║"
echo "╠════════════════════════════════════════════╣"
echo "║ Appuyer sur Ctrl+C pour arrêter            ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Attendre Ctrl+C
wait

# Nettoyer à l'arrêt
echo ""
echo "🛑 Arrêt du projet..."
kill $BACKEND_PID 2>/dev/null || true
kill $FRONTEND_PID 2>/dev/null || true
echo "✓ Projet arrêté"
