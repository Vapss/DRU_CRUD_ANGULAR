import requests
import json

# URL base de la API
BASE_URL = "http://127.0.0.1:8000"

def test_api():
    """Función para probar los endpoints de la API"""
    print("🚀 Probando la API DRU CRUD...")
    
    try:
        # 1. Probar endpoint raíz
        print("\n1. Probando endpoint raíz (/)...")
        response = requests.get(f"{BASE_URL}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        # 2. Probar endpoint de documentación
        print("\n2. Probando documentación (/docs)...")
        response = requests.get(f"{BASE_URL}/docs")
        print(f"   Status: {response.status_code}")
        print(f"   Documentación disponible: {'✅' if response.status_code == 200 else '❌'}")
        
        # 3. Probar registro de usuario
        print("\n3. Probando registro de usuario...")
        user_data = {
            "email": "test@example.com",
            "password": "testpassword123",
            "full_name": "Usuario de Prueba"
        }
        response = requests.post(f"{BASE_URL}/api/v1/auth/register", json=user_data)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
        
        # 4. Probar login
        print("\n4. Probando login...")
        login_data = {
            "email": "test@example.com",
            "password": "testpassword123"
        }
        response = requests.post(f"{BASE_URL}/api/v1/auth/login", json=login_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"   Token obtenido: {token_data['token_type']} {token_data['access_token'][:20]}...")
            token = token_data['access_token']
            
            # 5. Probar endpoints protegidos con token
            headers = {"Authorization": f"Bearer {token}"}
            
            print("\n5. Probando endpoint de categorías...")
            response = requests.get(f"{BASE_URL}/api/v1/budgets/categories", headers=headers)
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.json()}")
            
            print("\n6. Probando crear categoría...")
            category_data = {
                "name": "Alimentación",
                "type": "expense"
            }
            response = requests.post(f"{BASE_URL}/api/v1/budgets/categories", 
                                   json=category_data, headers=headers)
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.json()}")
            
            print("\n7. Probando endpoint de hábitos...")
            response = requests.get(f"{BASE_URL}/api/v1/habits/", headers=headers)
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.json()}")
        else:
            print(f"   ❌ Error en login: {response.json()}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al servidor. ¿Está ejecutándose en http://127.0.0.1:8000?")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

if __name__ == "__main__":
    test_api()
