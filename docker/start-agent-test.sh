#!/bin/bash

echo "========================================="
echo "SecureVault Agent Test Container"
echo "========================================="
echo ""

# Start SSH service
echo "Starting SSH service..."
service ssh start

# Wait for SSH to be ready
sleep 2

# Check if server URL is provided
if [ -z "$SERVER_URL" ]; then
    echo "ERROR: SERVER_URL environment variable not set"
    echo "Usage: docker run -e SERVER_URL=http://host.docker.internal:3001 -e TOKEN=your_token ..."
    exit 1
fi

if [ -z "$TOKEN" ]; then
    echo "ERROR: TOKEN environment variable not set"
    exit 1
fi

echo "✅ SSH service started"
echo "✅ Server: $SERVER_URL"
echo "✅ Token: ${TOKEN:0:16}...${TOKEN: -8}"
echo ""
echo "Container IP: $(hostname -I | awk '{print $1}')"
echo "SSH Port: 22"
echo ""
echo "To test attack from host machine:"
echo "  docker exec -it <container_name> bash /opt/attack.sh"
echo ""
echo "Or from outside container:"
echo "  for i in {1..6}; do ssh -o StrictHostKeyChecking=no fakeuser@localhost -p 2222; done"
echo ""
echo "========================================="
echo "Starting SecureVault Agent..."
echo "========================================="
echo ""

# Start agent
exec python3 /opt/securevault-agent.py \
    --server "$SERVER_URL" \
    --token "$TOKEN"
