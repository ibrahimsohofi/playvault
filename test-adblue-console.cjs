const https = require('https');

// Test the AdBlueMedia script
console.log('🔍 Testing AdBlueMedia Integration...\n');

// 1. Test script availability
https.get('https://dfmpe7igjx4jo.cloudfront.net/420ad58.js', (res) => {
    let data = '';
    
    res.on('data', chunk => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('✅ Script loaded successfully');
        console.log(`📊 Response status: ${res.statusCode}`);
        console.log(`📏 Script size: ${data.length} characters\n`);
        
        // 2. Check for key patterns in the script
        console.log('🔍 Analyzing script content...');
        
        // Check for xfContentLocker
        if (data.includes('xfContentLocker')) {
            console.log('✅ xfContentLocker found in script');
        } else {
            console.log('❌ xfContentLocker not found');
        }
        
        // Check for setLockFunctions
        if (data.includes('setLockFunctions')) {
            console.log('✅ setLockFunctions found in script');
        } else {
            console.log('❌ setLockFunctions not found');
        }
        
        // Extract the locks array
        const locksMatch = data.match(/this\.locks=\[([^\]]+)\]/);
        if (locksMatch) {
            const locksArray = locksMatch[1].split(',').map(lock => lock.trim().replace(/"/g, ''));
            console.log('✅ Found locks array:');
            console.log(`   Available functions: ${locksArray.map(lock => '_' + lock).join(', ')}`);
            
            // Check if _RH is available
            if (locksArray.includes('RH')) {
                console.log('✅ _RH function should be available');
            } else {
                console.log('❌ _RH function not found in locks array');
            }
        } else {
            console.log('❌ Could not extract locks array');
        }
        
        // Check for CPBContentLocker
        if (data.includes('CPBContentLocker')) {
            console.log('✅ CPBContentLocker class found');
        } else {
            console.log('❌ CPBContentLocker class not found');
        }
        
        console.log('\n🏁 Analysis complete!');
    });
    
}).on('error', (err) => {
    console.error('❌ Error fetching script:', err.message);
});