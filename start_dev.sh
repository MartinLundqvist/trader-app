#!/bin/bash

# Start the frontend service in the background
(cd ./frontend && npm run dev) &

# Start the traders service in the background
(cd ./trader && npm run dev) &

# Activate the virtual environment and start the strategies service in the background
(cd ./strategies && source ./.venv/bin/activate && python3 ./main.py) &

# Wait for all background processes to complete
wait