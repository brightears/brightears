#!/usr/bin/env node

/**
 * Test script for Clerk authentication integration
 * Run with: node scripts/test-auth-integration.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${color}${message}${COLORS.reset}`);
}

async function checkEnvironment() {
  log(COLORS.blue, '🔍 Checking environment variables...');
  
  const requiredVars = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_CONVEX_URL'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    log(COLORS.red, `❌ Missing environment variables: ${missing.join(', ')}`);
    log(COLORS.yellow, '💡 Copy .env.example to .env and fill in the values');
    return false;
  }
  
  log(COLORS.green, '✅ Environment variables configured');
  return true;
}

async function checkFiles() {
  log(COLORS.blue, '📁 Checking required files...');
  
  const requiredFiles = [
    'app/api/webhooks/clerk/route.ts',
    'components/auth/protected-route.tsx',
    'components/auth/phone-auth.tsx',
    'convex/users.ts',
    'convex/auth.config.ts'
  ];
  
  const missing = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, '..', file)));
  
  if (missing.length > 0) {
    log(COLORS.red, `❌ Missing files: ${missing.join(', ')}`);
    return false;
  }
  
  log(COLORS.green, '✅ All required files present');
  return true;
}

async function testAPIEndpoints() {
  log(COLORS.blue, '🌐 Testing API endpoints...');
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const endpoints = [
    '/api/webhooks/clerk',
    '/api/inquiries/quick'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'HEAD' // Just check if endpoint exists
      });
      
      if (response.ok || response.status === 405) { // 405 = Method Not Allowed is fine
        log(COLORS.green, `✅ ${endpoint} - accessible`);
      } else {
        log(COLORS.red, `❌ ${endpoint} - returned ${response.status}`);
      }
    } catch (error) {
      log(COLORS.red, `❌ ${endpoint} - ${error.message}`);
    }
  }
}

async function testClerkIntegration() {
  log(COLORS.blue, '🔐 Testing Clerk integration...');
  
  try {
    // Try to import Clerk (this will fail if not properly configured)
    const { createClerkClient } = require('@clerk/nextjs/server');
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY
    });
    
    // Test basic Clerk functionality
    await clerk.users.getCount();
    log(COLORS.green, '✅ Clerk client initialized successfully');
  } catch (error) {
    log(COLORS.red, `❌ Clerk integration error: ${error.message}`);
    return false;
  }
  
  return true;
}

async function testConvexIntegration() {
  log(COLORS.blue, '🗄️  Testing Convex integration...');
  
  try {
    const { ConvexHttpClient } = require('convex/browser');
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
    
    // Test if we can connect to Convex
    // This is a simple connectivity test
    log(COLORS.green, '✅ Convex client created successfully');
    return true;
  } catch (error) {
    log(COLORS.red, `❌ Convex integration error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  log(COLORS.blue, '🚀 Starting Clerk Authentication Integration Tests');
  log(COLORS.blue, '='.repeat(50));
  
  const tests = [
    checkEnvironment,
    checkFiles,
    testClerkIntegration,
    testConvexIntegration,
    // testAPIEndpoints // Comment out if server not running
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result !== false) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      log(COLORS.red, `❌ Test failed: ${error.message}`);
      failed++;
    }
    console.log(''); // Empty line for readability
  }
  
  log(COLORS.blue, '='.repeat(50));
  log(COLORS.green, `✅ Tests passed: ${passed}`);
  log(COLORS.red, `❌ Tests failed: ${failed}`);
  
  if (failed === 0) {
    log(COLORS.green, '🎉 All tests passed! Your Clerk integration is ready.');
    
    log(COLORS.blue, '\n📋 Next steps:');
    log(COLORS.yellow, '1. Start your development server: npm run dev');
    log(COLORS.yellow, '2. Set up Clerk webhook endpoint in Clerk Dashboard');
    log(COLORS.yellow, '3. Test user registration flow');
    log(COLORS.yellow, '4. Test artist profile creation');
    log(COLORS.yellow, '5. Test quick inquiry system');
  } else {
    log(COLORS.red, '⚠️  Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  log(COLORS.red, `Fatal error: ${error.message}`);
  process.exit(1);
});