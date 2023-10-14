#!/bin/bash

# Stop any running containers for this compose configuration
docker-compose down

# Rebuild the images
docker-compose build

# Launch the containers
docker-compose up -d