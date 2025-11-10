#!/bin/bash

echo "🚀 SSH Brute Force Attack Test (Linux)"
echo "======================================="
echo ""
echo "Attempting 6 SSH connections with invalid user..."
echo "Agent should detect after 5 attempts!"
echo ""

for i in {1..6}; do
    echo "[$i/6] Attack attempt..."
    echo "wrong_password" | ssh -o ConnectTimeout=2 -o StrictHostKeyChecking=no -o NumberOfPasswordPrompts=1 fakeuser@localhost 2>&1 | head -1
    sleep 1
done

echo ""
echo "✅ Attack completed!"
echo ""
echo "Check /var/log/auth.log:"
tail -20 /var/log/auth.log | grep "Failed password"
echo ""
echo "Check agent logs above for:"
echo "  → Found X failed SSH attempts"
echo "  🚨 X threat(s) detected!"
echo "  → SSH brute force attack detected"
echo ""
echo "Then refresh dashboard to see the threat!"
