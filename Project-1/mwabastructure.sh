#!/bin/bash

echo "🎉 Creating Mwaba project folder structure..."

# Root folder
mkdir -p mwaba

# Frontend structure
mkdir -p mwaba/frontend/src/components
mkdir -p mwaba/frontend/src/services

# Backend structure
mkdir -p mwaba/backend/api
mkdir -p mwaba/backend/routes
mkdir -p mwaba/backend/workers
mkdir -p mwaba/backend/modules
mkdir -p mwaba/backend/db

# Files (empty placeholders)
touch mwaba/frontend/src/components/MwabaVoiceAssistant.jsx
touch mwaba/frontend/src/components/AdminWhatsAppPanel.jsx
touch mwaba/frontend/src/services/api.js
touch mwaba/frontend/src/App.jsx
touch mwaba/frontend/src/index.jsx
touch mwaba/frontend/package.json
touch mwaba/frontend/vite.config.js

touch mwaba/backend/server.js
touch mwaba/backend/setupMwaba.js
touch mwaba/backend/setupSampleThreads.js
touch mwaba/backend/modules/mwaba_whatsapp_config.json
touch mwaba/backend/modules/gptHelpers.js
touch mwaba/backend/workers/whatsappWorker.js
touch mwaba/backend/api/voiceCommand.js
touch mwaba/backend/routes/whatsapp.js
touch mwaba/backend/routes/schedule.js
touch mwaba/backend/routes/calls.js
touch mwaba/backend/routes/reminders.js
touch mwaba/backend/package.json
touch mwaba/backend/.env

# Installer & README
touch mwaba/installMwaba.js
touch mwaba/README.md

echo "✅ Mwaba folder structure created!"
echo "Next: paste the corresponding code into each file."
