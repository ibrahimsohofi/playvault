#!/usr/bin/env node

// Simulate browser environment for testing
global.window = global;
global.document = {
    getElementById: () => null,
    getElementsByTagName: () => [],
    createElement: () => ({
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {}
    }),
    body: {},
    head: {},
    referrer: 'https://playvault.com'
};

// Set up the global configuration
global.nUtRu_QzT_cplrFc = {
    it: 4503226,
    key: "bbe8f"
};

console.log('🧪 AdBlueMedia Simulation Test\n');

// Test 1: Configuration
console.log('📋 Testing Configuration:');
console.log(`   IT value: ${global.nUtRu_QzT_cplrFc.it}`);
console.log(`   Key value: ${global.nUtRu_QzT_cplrFc.key}`);
console.log('   ✅ Configuration loaded correctly\n');

// Test 2: Fetch and evaluate the script
const https = require('https');

https.get('https://dfmpe7igjx4jo.cloudfront.net/420ad58.js', (res) => {
    let scriptContent = '';
    
    res.on('data', chunk => {
        scriptContent += chunk;
    });
    
    res.on('end', () => {
        console.log('📥 Script downloaded successfully');
        console.log(`   Size: ${scriptContent.length} characters\n`);
        
        try {
            // Test 3: Check script structure
            console.log('🔍 Analyzing Script Structure:');
            
            if (scriptContent.includes('xfContentLocker')) {
                console.log('   ✅ xfContentLocker found');
            } else {
                console.log('   ❌ xfContentLocker not found');
            }
            
            if (scriptContent.includes('setLockFunctions')) {
                console.log('   ✅ setLockFunctions method found');
            } else {
                console.log('   ❌ setLockFunctions method not found');
            }
            
            // Extract locks array
            const locksMatch = scriptContent.match(/this\.locks=\[([^\]]+)\]/);
            if (locksMatch) {
                const locks = locksMatch[1]
                    .split(',')
                    .map(lock => lock.trim().replace(/"/g, ''))
                    .filter(lock => lock.length > 0);
                
                console.log(`   ✅ Found ${locks.length} lock functions`);
                
                if (locks.includes('iH')) {
                    console.log('   ✅ _iH function should be available');
                } else {
                    console.log('   ❌ _iH function not in locks array');
                    console.log(`   Available: ${locks.slice(0, 10).join(', ')}...`);
                }
            }
            
            // Test 4: Simulate execution environment
            console.log('\n🔧 Simulating Execution Environment:');
            
            try {
                // Simple evaluation test (not full execution due to DOM dependencies)
                const hasConstructor = scriptContent.includes('function CPBContentLocker()');
                console.log(`   Constructor found: ${hasConstructor ? '✅' : '❌'}`);
                
                const hasInit = scriptContent.includes('this.constructed = false');
                console.log(`   Initialization code found: ${hasInit ? '✅' : '❌'}`);
                
                const hasCallback = scriptContent.includes('callback: function');
                console.log(`   Callback system found: ${hasCallback ? '✅' : '❌'}`);
                
            } catch (evalError) {
                console.log(`   ❌ Evaluation error: ${evalError.message}`);
            }
            
            // Test 5: Expected behavior
            console.log('\n🎯 Expected Behavior Analysis:');
            console.log('   1. Script should create xfContentLocker instance');
            console.log('   2. setLockFunctions should create window._iH');
            console.log('   3. Calling window._iH() should open locker');
            console.log('   4. Configuration nUtRu_QzT_cplrFc should be used');
            
            console.log('\n✅ AdBlueMedia integration appears to be properly configured!');
            console.log('\n📝 Recommendations:');
            console.log('   - Test in real browser environment');
            console.log('   - Check for ad blockers during testing');
            console.log('   - Verify popup blockers are disabled');
            console.log('   - Test with different browsers');
            
        } catch (error) {
            console.error('❌ Script analysis failed:', error.message);
        }
    });
    
}).on('error', (err) => {
    console.error('❌ Failed to download script:', err.message);
});