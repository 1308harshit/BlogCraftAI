#!/bin/bash

# BlogCraft AI - Production Setup Script
echo "🚀 Setting up BlogCraft AI for production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required tools are installed
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Install script dependencies
echo -e "${BLUE}Installing automation script dependencies...${NC}"
cd scripts
npm install
cd ..

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Script dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install script dependencies${NC}"
    exit 1
fi

# Check environment variables
echo -e "${BLUE}Checking environment configuration...${NC}"

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Creating from template...${NC}"
    cp .env.local.example .env.local
    echo -e "${YELLOW}📝 Please edit .env.local with your API keys before continuing${NC}"
else
    echo -e "${GREEN}✅ Environment file found${NC}"
fi

# Build the application
echo -e "${BLUE}Building application...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Application built successfully${NC}"
else
    echo -e "${RED}❌ Build failed. Please check your configuration.${NC}"
    exit 1
fi

# Setup complete
echo -e "${GREEN}"
echo "🎉 BlogCraft AI setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Set up your Supabase database (run scripts/setup-database.sql)"
echo "3. Configure Stripe products (node scripts/setup-stripe-products.js)"
echo "4. Deploy to Vercel (vercel --prod)"
echo "5. Start lead generation (cd scripts && npm run scrape-leads)"
echo ""
echo "For detailed instructions, see deployment-guide.md"
echo -e "${NC}"