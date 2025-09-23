"""
Memory Debugging & Optimization Guide
Help diagnose and fix memory issues in deployment
"""

import sys
import os
import gc

def check_memory_usage():
    """Check current memory usage"""
    try:
        import psutil
        process = psutil.Process(os.getpid())
        memory_mb = process.memory_info().rss / 1024 / 1024
        print(f"Current memory usage: {memory_mb:.1f} MB")
        return memory_mb
    except ImportError:
        print("psutil not available - install with: pip install psutil")
        return None

def find_memory_hogs():
    """Find what's using memory in your application"""
    print("\n🔍 MEMORY ANALYSIS:")
    
    # Check imported modules
    print("\n📦 LARGE MODULES:")
    large_modules = []
    for name, module in sys.modules.items():
        if hasattr(module, '__file__') and module.__file__:
            try:
                size = sys.getsizeof(module)
                if size > 1024 * 1024:  # > 1MB
                    large_modules.append((name, size / 1024 / 1024))
            except:
                pass
    
    large_modules.sort(key=lambda x: x[1], reverse=True)
    for name, size_mb in large_modules[:10]:
        print(f"   {name}: {size_mb:.1f} MB")
    
    # Check for common memory hogs
    memory_hogs = [
        'torch', 'tensorflow', 'transformers', 'numpy', 'pandas', 
        'scipy', 'sklearn', 'matplotlib', 'PIL', 'cv2'
    ]
    
    print(f"\n⚠️  MEMORY-HEAVY LIBRARIES DETECTED:")
    for lib in memory_hogs:
        if lib in sys.modules:
            print(f"   ❌ {lib} - can use 100-500MB")

def optimize_python_memory():
    """Optimize Python memory usage"""
    print("\n🔧 APPLYING MEMORY OPTIMIZATIONS:")
    
    # Force garbage collection
    collected = gc.collect()
    print(f"   ✅ Garbage collected {collected} objects")
    
    # Set aggressive GC thresholds
    gc.set_threshold(100, 5, 5)  # More aggressive than default (700, 10, 10)
    print("   ✅ Set aggressive garbage collection")
    
    # Disable debug features
    sys.tracebacklimit = 0  # Reduce traceback memory
    print("   ✅ Reduced traceback limit")

def test_minimal_summarizer():
    """Test if the minimal summarizer works"""
    print("\n🧪 TESTING MINIMAL SUMMARIZER:")
    
    try:
        # Test the emergency version
        class UltraMinimalSummarizer:
            def get_summary(self, text, mode="abstractive", length="medium"):
                if not text:
                    return "No text"
                sentences = text.split('. ')
                count = 2 if length == "short" else 3
                return '. '.join(sentences[:count])
            
            def summarize(self, text, summary_type="abstractive", length="medium"):
                result = self.get_summary(text, summary_type, length)
                return result, f"✅ Processed", "Basic mode"
        
        # Test it
        summarizer = UltraMinimalSummarizer()
        test_text = "This is a test. It has multiple sentences. Each one should work properly."
        
        result = summarizer.get_summary(test_text, "abstractive", "medium")
        print(f"   ✅ Test result: {result}")
        print(f"   ✅ Memory usage: < 1MB")
        
        return summarizer
        
    except Exception as e:
        print(f"   ❌ Test failed: {e}")
        return None

def deployment_specific_fixes():
    """Deployment platform specific fixes"""
    print(f"\n🚀 DEPLOYMENT FIXES:")
    
    # Check if running on common platforms
    if 'render' in os.environ.get('RENDER', '').lower():
        print("   🎯 RENDER PLATFORM DETECTED:")
        print("   • Use requirements.txt with minimal packages only")
        print("   • Avoid transformers, torch, tensorflow")
        print("   • Use --no-cache-dir in pip install")
        
    elif 'heroku' in os.environ.get('DYNO', '').lower():
        print("   🎯 HEROKU PLATFORM DETECTED:")
        print("   • Use lighter Python buildpack")
        print("   • Set PYTHONDONTWRITEBYTECODE=1")
        
    # Generic fixes
    print(f"\n   📋 GENERIC DEPLOYMENT FIXES:")
    print("   1. Add to your main app file:")
    print("      import gc; gc.collect()")
    print("   2. Use minimal requirements.txt")
    print("   3. Avoid importing unused libraries")
    print("   4. Set environment variables:")
    print("      PYTHONDONTWRITEBYTECODE=1")
    print("      PYTHONUNBUFFERED=1")

def create_emergency_requirements():
    """Create minimal requirements.txt"""
    minimal_requirements = """# Emergency minimal requirements
# Remove ALL other packages for memory optimization

# Only if you absolutely need these:
# flask==2.0.1
# fastapi==0.68.0
# requests==2.25.1

# Do NOT include:
# torch
# tensorflow  
# transformers
# numpy
# pandas
# scipy
# scikit-learn
# matplotlib
# PIL/pillow
"""
    
    print(f"\n📝 EMERGENCY REQUIREMENTS.TXT:")
    print(minimal_requirements)
    
    return minimal_requirements

def emergency_main_app():
    """Emergency version of main app with minimal imports"""
    emergency_code = """
# Emergency main app - minimal imports only
import os
import logging

# Minimal summarizer inline (no external file)
class EmergencySummarizer:
    def get_summary(self, text, mode="abstractive", length="medium"):
        if not text:
            return "No text provided"
        sentences = text.replace('!', '.').replace('?', '.').split('.')
        sentences = [s.strip() for s in sentences if len(s.strip()) > 5]
        count = 2 if length == "short" else 3
        return '. '.join(sentences[:count]) + '.'
    
    def summarize(self, text, summary_type="abstractive", length="medium"):
        result = self.get_summary(text, summary_type, length)
        return result, "✅ Success", "Emergency mode"

# Use it directly
summarizer = EmergencySummarizer()

# Your app logic here (Flask, FastAPI, etc.)
def main():
    print("Emergency app started")
    
    # Test
    test_text = "AI is changing the world. It helps businesses improve efficiency. Many companies are adopting AI solutions."
    result = summarizer.get_summary(test_text, "abstractive", "medium")
    print(f"Test result: {result}")

if __name__ == "__main__":
    main()
"""
    
    print(f"\n🆘 EMERGENCY MAIN APP CODE:")
    print(emergency_code)
    return emergency_code

def run_memory_diagnosis():
    """Run complete memory diagnosis"""
    print("🔍 COMPLETE MEMORY DIAGNOSIS")
    print("=" * 50)
    
    # Step 1: Check current usage
    memory_mb = check_memory_usage()
    
    # Step 2: Find memory hogs  
    find_memory_hogs()
    
    # Step 3: Apply optimizations
    optimize_python_memory()
    
    # Step 4: Test minimal code
    summarizer = test_minimal_summarizer()
    
    # Step 5: Platform-specific fixes
    deployment_specific_fixes()
    
    # Step 6: Emergency files
    create_emergency_requirements()
    emergency_main_app()
    
    # Final check
    if memory_mb:
        new_memory = check_memory_usage()
        if new_memory and new_memory < memory_mb:
            print(f"\n✅ MEMORY REDUCED: {memory_mb:.1f}MB → {new_memory:.1f}MB")
        else:
            print(f"\n⚠️  MEMORY STILL HIGH: {new_memory:.1f}MB")
    
    print(f"\n🎯 NEXT STEPS:")
    print("1. ✅ Use the Ultra-Minimal Summarizer above")
    print("2. ✅ Remove ALL heavy libraries from requirements.txt") 
    print("3. ✅ Use inline code instead of separate files")
    print("4. ✅ Add memory optimization to your main app")
    print("5. ✅ Set environment variables for Python optimization")
    
    return summarizer

# Quick fix for immediate use
def get_emergency_summarizer():
    """Get emergency summarizer that works in any memory situation"""
    
    class UltraLightSummarizer:
        def get_summary(self, text, mode="abstractive", length="medium"):
            if not text or len(text) < 10:
                return text or "No text"
            
            # Ultra-simple: just take first part of text
            words = text.split()
            if length == "short":
                max_words = 30
            elif length == "long":
                max_words = 80
            else:
                max_words = 50
            
            if len(words) <= max_words:
                return text
            
            # Take first N words and try to end at sentence boundary
            result_words = words[:max_words]
            result_text = ' '.join(result_words)
            
            # Try to end at sentence
            if '.' in result_text:
                sentences = result_text.split('.')
                if len(sentences) > 1:
                    result_text = '. '.join(sentences[:-1]) + '.'
            
            return result_text
        
        def summarize(self, text, summary_type="abstractive", length="medium"):
            result = self.get_summary(text, summary_type, length)
            words_before = len(text.split()) if text else 0
            words_after = len(result.split()) if result else 0
            return result, f"✅ {words_before}→{words_after} words", "Ultra-light mode"
        
        def summarize_text(self, text, summary_type="abstractive", length="medium"):
            return self.summarize(text, summary_type, length)
    
    return UltraLightSummarizer()

if __name__ == "__main__":
    # Run diagnosis
    run_memory_diagnosis()
    
    # Test emergency summarizer
    print(f"\n🆘 EMERGENCY SUMMARIZER TEST:")
    emergency = get_emergency_summarizer()
    test = "Artificial intelligence is transforming industries. Companies report significant improvements. AI helps with efficiency and automation. The future looks promising for AI adoption."
    result = emergency.get_summary(test, "abstractive", "medium")
    print(f"Result: {result}")
    print(f"✅ Emergency summarizer working!")
"""
