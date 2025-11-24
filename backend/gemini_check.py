import google.generativeai as genai

# Replace with your actual API key
GOOGLE_API_KEY = "AIzaSyAkys5WBqlGd72s_sDyWgRe9V1c_LaFwH0"

genai.configure(api_key=GOOGLE_API_KEY)

print("--- Models available for Content Generation ---")
try:
    for m in genai.list_models():
        # We only want models that can generate content (not just embeddings)
        if 'generateContent' in m.supported_generation_methods:
            print(f"Name: {m.name}")
            print(f"Display Name: {m.display_name}")
            print("-" * 30)
except Exception as e:
    print(f"Error: {e}")
    print("Check if your API key is valid.")