#!/usr/bin/env bash

# NexusFL Unified Launcher
# Starts both FastAPI Backend and Next.js Frontend with a single command

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}====================================================${NC}"
echo -e "${GREEN}  NexusFL // Zero-Trust Banking Intelligence Platform${NC}"
echo -e "${CYAN}====================================================${NC}"

# Check & cleanup any existing stuck processes on port 8000 and 3000
echo -e "${YELLOW}● Checking ports 8000 & 3000...${NC}"
fuser -k 8000/tcp 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true

# Function to handle cleanup on Ctrl+C
cleanup() {
    echo -e "\n${YELLOW}● Stopping all NexusFL services...${NC}"
    kill 0
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Start Backend
echo -e "${GREEN}● Starting Backend (FastAPI + PyTorch) on http://localhost:8000...${NC}"
cd "$BACKEND_DIR"
if [ -f ".venv/bin/uvicorn" ]; then
    .venv/bin/uvicorn app.main:app --reload --port 8000 &
else
    uvicorn app.main:app --reload --port 8000 &
fi
BACKEND_PID=$!

# Wait 1.5s for backend to initialize
sleep 1.5

# 2. Start Frontend
echo -e "${BLUE}● Starting Frontend (Next.js Dashboard) on http://localhost:3000...${NC}"
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo -e "\n${GREEN}✔ NexusFL is up and running!${NC}"
echo -e "${CYAN}  ► Frontend Console:${NC} http://localhost:3000"
echo -e "${CYAN}  ► Backend API Docs:${NC} http://localhost:8000/docs"
echo -e "${CYAN}  ► Health Status:   ${NC} http://localhost:8000/health"
echo -e "${YELLOW}Press [CTRL+C] to stop all services simultaneously.${NC}\n"

wait
