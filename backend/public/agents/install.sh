#!/bin/bash
# SecureVault Agent Installer for Linux/macOS

set -e

echo "=================================================="
echo "  SecureVault Agent Installer v1.0.0"
echo "=================================================="
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed"
    echo "Please install Python 3 and try again"
    exit 1
fi

echo "✓ Python 3 detected: $(python3 --version)"
echo ""

# Parse arguments
SERVER_URL=""
TOKEN=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --server)
            SERVER_URL="$2"
            shift 2
            ;;
        --token)
            TOKEN="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [ -z "$SERVER_URL" ] || [ -z "$TOKEN" ]; then
    echo "Error: Both --server and --token are required"
    echo ""
    echo "Usage: $0 --server <SERVER_URL> --token <TOKEN>"
    echo ""
    echo "Example:"
    echo "  $0 --server https://hackathon-vpb-onebillion.vercel.app --token abc123..."
    exit 1
fi

# Installation directory
INSTALL_DIR="$HOME/.securevault"
AGENT_SCRIPT="$INSTALL_DIR/securevault-agent.py"
CONFIG_FILE="$INSTALL_DIR/config.txt"

echo "Installing agent to: $INSTALL_DIR"
echo ""

# Create installation directory
mkdir -p "$INSTALL_DIR"

# Download agent script (for demo, we'll use the one in the repo)
if [ -f "securevault-agent.py" ]; then
    cp securevault-agent.py "$AGENT_SCRIPT"
else
    echo "Error: securevault-agent.py not found"
    echo "Please run this script from the agent directory"
    exit 1
fi

chmod +x "$AGENT_SCRIPT"

# Save configuration
cat > "$CONFIG_FILE" << EOF
SERVER_URL=$SERVER_URL
TOKEN=$TOKEN
INSTALLED_AT=$(date)
EOF

echo "✓ Agent installed successfully!"
echo ""
echo "Configuration:"
echo "  Server: $SERVER_URL"
echo "  Token: ${TOKEN:0:16}...${TOKEN: -8}"
echo "  Install Dir: $INSTALL_DIR"
echo ""
echo "To start the agent, run:"
echo "  python3 $AGENT_SCRIPT --server $SERVER_URL --token $TOKEN"
echo ""
echo "Or run it in the background:"
echo "  nohup python3 $AGENT_SCRIPT --server $SERVER_URL --token $TOKEN > $INSTALL_DIR/agent.log 2>&1 &"
echo ""
echo "To check status:"
echo "  tail -f $INSTALL_DIR/agent.log"
echo ""
