# test_backend.py - Windows-compatible test script
import requests
import json
import time

def test_backend():
    """Test backend connection with proper Windows PowerShell support"""
    
    print("🧪 Testing Backend Connection (Windows)")
    print("=" * 50)
    
    # Use localhost instead of 127.0.0.1 for Windows compatibility
    base_url = "http://localhost:8000"
    
    # Test sample with AI patterns
    test_text = "In today's fast-paced world, it is important to note that leveraging cutting-edge AI technologies will ultimately transform business paradigms. With that being said, organizations must optimize their synergy to achieve unprecedented results."
    
    print(f"📡 Testing connection to: {base_url}")
    print(f"📝 Sample text length: {len(test_text)} characters")
    print()
    
    # Test 1: Basic connection
    print("1️⃣ Testing Basic Connection...")
    try:
        response = requests.get(f"{base_url}/", timeout=10)
        print(f"   ✅ Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Response: {data.get('message', 'Unknown')}")
        else:
            print(f"   ❌ Unexpected status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection refused - backend not running")
        print("   💡 Start backend with: uvicorn main:app --reload --host 0.0.0.0 --port 8000")
        return False
    except Exception as e:
        print(f"   ❌ Connection failed: {e}")
        return False
    
    # Test 2: Health check
    print("\n2️⃣ Testing Health Check...")
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        print(f"   ✅ Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Health: {data.get('status', 'Unknown')}")
            print(f"   ✅ API Key: {'✅' if data.get('api_key_configured') else '❌'}")
    except Exception as e:
        print(f"   ❌ Health check failed: {e}")
    
    # Test 3: AI Analysis
    print("\n3️⃣ Testing AI Analysis...")
    try:
        payload = {"text": test_text}
        headers = {"Content-Type": "application/json"}
        
        print("   📤 Sending analysis request...")
        response = requests.post(
            f"{base_url}/analyze",
            json=payload,
            headers=headers,
            timeout=30
        )
        
        print(f"   ✅ Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            ai_score = data.get('ai_score', 0)
            classification = data.get('classification', 'Unknown')
            patterns = data.get('patterns', {})
            
            print(f"   🤖 AI Score: {ai_score}%")
            print(f"   📊 Classification: {classification}")
            print(f"   🔍 Pattern Categories: {len(patterns)}")
            
            if patterns:
                print("   📋 Detected Patterns:")
                for category, data in patterns.items():
                    indicators = data.get('indicators', [])
                    print(f"      • {category}: {len(indicators)} indicators")
                    for indicator in indicators[:2]:
                        print(f"        - '{indicator}'")
            
            print("   ✅ Analysis working correctly!")
            return True
        else:
            print(f"   ❌ Analysis failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Analysis test failed: {e}")
        return False

def test_cors():
    """Test CORS configuration for frontend"""
    print("\n4️⃣ Testing CORS for Frontend...")
    try:
        headers = {
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type"
        }
        
        response = requests.options("http://localhost:8000/analyze", headers=headers, timeout=10)
        print(f"   ✅ CORS Preflight: {response.status_code}")
        
        cors_headers = [h for h in response.headers.keys() if h.lower().startswith('access-control')]
        if cors_headers:
            print("   ✅ CORS headers present")
        else:
            print("   ⚠️  No CORS headers found")
            
    except Exception as e:
        print(f"   ❌ CORS test failed: {e}")

if __name__ == "__main__":
    print("🚀 Backend Connection Test for Windows")
    print("Make sure your backend is running first!")
    print("Command: uvicorn main:app --reload --host 0.0.0.0 --port 8000")
    print()
    
    # Wait a moment for manual startup
    input("Press Enter when your backend is running...")
    
    success = test_backend()
    test_cors()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 Backend is working! Ready for frontend connection.")
        print("\n📋 Frontend Connection Info:")
        print("   API URL: http://localhost:8000")
        print("   Test URL: http://localhost:8000/docs")
        print("   Status: ✅ Ready")
    else:
        print("💥 Backend test failed. Check errors above.")
        print("\n🔧 Quick Fixes:")
        print("1. Restart backend: uvicorn main:app --reload --host 0.0.0.0 --port 8000")
        print("2. Check .env file has ANTHROPIC_API_KEY")
        print("3. Try different port: --port 8001")
        print("4. Check Windows Firewall settings")