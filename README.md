# DRU CRUD Angular - Sistema de Presupuestos y Hábitos

Una aplicación completa para gestión de presupuestos personales y seguimiento de hábitos, construida con FastAPI (backend) y Angular (frontend).

## 🏗️ Estructura del Proyecto

```
DRU_CRUD_ANGULAR/
├── apps/
│   ├── backend/          # API FastAPI
│   │   ├── app/
│   │   │   ├── api/v1/   # Endpoints de la API
│   │   │   ├── core/     # Configuración y seguridad
│   │   │   ├── db/       # Base de datos y sesiones
│   │   │   ├── models/   # Modelos SQLModel
│   │   │   ├── schemas/  # Esquemas Pydantic
│   │   │   └── main.py   # Aplicación principal
│   │   ├── pyproject.toml
│   │   └── test_api.py
│   └── frontend/         # Aplicación Angular (por implementar)
├── .venv/               # Entorno virtual Python
└── README.md
```

## 🚀 Instalación y Configuración

### Backend (FastAPI)

1. **Clonar el repositorio:**
   ```bash
   git clone <tu-repo-url>
   cd DRU_CRUD_ANGULAR
   ```

2. **Crear y activar entorno virtual:**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # o
   source .venv/bin/activate  # Linux/Mac
   ```

3. **Instalar dependencias:**
   ```bash
   cd apps/backend
   pip install -e .
   ```

4. **Iniciar el servidor:**
   ```bash
   cd apps/backend
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```

5. **Acceder a la documentación:**
   - Documentación interactiva: http://127.0.0.1:8000/docs
   - Documentación alternativa: http://127.0.0.1:8000/redoc

## 📋 API Endpoints

### 🔐 Autenticación

#### Registrar Usuario
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña123",
  "full_name": "Nombre Completo"
}
```

**Respuesta:**
```json
{
  "message": "User created successfully",
  "email": "usuario@example.com"
}
```

#### Iniciar Sesión
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 💰 Gestión de Presupuestos

> **Nota:** Todos los endpoints de presupuestos requieren autenticación. Incluir header: `Authorization: Bearer <token>`

#### Categorías

**Listar Categorías**
```http
GET /api/v1/budgets/categories
Authorization: Bearer <token>
```

**Crear Categoría**
```http
POST /api/v1/budgets/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alimentación",
  "type": "expense"  // "income" | "expense"
}
```

#### Transacciones

**Listar Transacciones**
```http
GET /api/v1/budgets/transactions
Authorization: Bearer <token>

# Filtrar por mes y año (opcional)
GET /api/v1/budgets/transactions?year=2025&month=9
```

**Crear Transacción**
```http
POST /api/v1/budgets/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 2000.00,        // Positivo para ingresos, negativo para gastos
  "tx_date": "2025-09-01",  // Formato: YYYY-MM-DD
  "note": "Salario mensual",
  "category_id": 1          // ID de la categoría (opcional)
}
```

#### Reportes

**Reporte Mensual**
```http
GET /api/v1/budgets/reports/month?year=2025&month=9
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "income": 2000.00,
  "expense": 350.50,
  "balance": 1649.50,
  "byCategory": [
    {
      "category": "Salario",
      "total": 2000.00
    },
    {
      "category": "Alimentación",
      "total": -350.50
    }
  ]
}
```

### 🎯 Hábitos (Próximamente)

```http
GET /api/v1/habits/
Authorization: Bearer <token>
```

## 🧪 Ejemplos de Uso con PowerShell

### 1. Registro y Login
```powershell
# Registrar usuario
$userData = @{
    email = "test@example.com"
    password = "password123"
    full_name = "Usuario Test"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/auth/register" -Method Post -Body $userData -ContentType "application/json"

# Login y obtener token
$loginData = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/auth/login" -Method Post -Body $loginData -ContentType "application/json"
$token = $response.access_token
$headers = @{ Authorization = "Bearer $token" }
```

### 2. Gestión de Categorías
```powershell
# Crear categoría de ingreso
$incomeCategory = @{
    name = "Salario"
    type = "income"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/budgets/categories" -Method Post -Body $incomeCategory -ContentType "application/json" -Headers $headers

# Crear categoría de gasto
$expenseCategory = @{
    name = "Alimentación"
    type = "expense"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/budgets/categories" -Method Post -Body $expenseCategory -ContentType "application/json" -Headers $headers

# Listar todas las categorías
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/budgets/categories" -Method Get -Headers $headers
```

### 3. Gestión de Transacciones
```powershell
# Crear transacción de ingreso
$incomeTransaction = @{
    amount = 3000.00
    tx_date = "2025-09-01"
    note = "Salario mensual"
    category_id = 1  # ID de la categoría "Salario"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/budgets/transactions" -Method Post -Body $incomeTransaction -ContentType "application/json" -Headers $headers

# Crear transacción de gasto
$expenseTransaction = @{
    amount = -150.00
    tx_date = "2025-09-02"
    note = "Supermercado"
    category_id = 2  # ID de la categoría "Alimentación"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/budgets/transactions" -Method Post -Body $expenseTransaction -ContentType "application/json" -Headers $headers

# Listar transacciones
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/budgets/transactions" -Method Get -Headers $headers
```

### 4. Generar Reportes
```powershell
# Obtener reporte del mes actual
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/budgets/reports/month?year=2025&month=9" -Method Get -Headers $headers
```

## 🛠️ Ejemplos con cURL

```bash
# Registro
curl -X POST "http://127.0.0.1:8000/api/v1/auth/register" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'

# Login
curl -X POST "http://127.0.0.1:8000/api/v1/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'

# Crear categoría (reemplazar <TOKEN> con el token obtenido)
curl -X POST "http://127.0.0.1:8000/api/v1/budgets/categories" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <TOKEN>" \
     -d '{"name":"Alimentación","type":"expense"}'

# Crear transacción
curl -X POST "http://127.0.0.1:8000/api/v1/budgets/transactions" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <TOKEN>" \
     -d '{"amount":-150.00,"tx_date":"2025-09-01","note":"Supermercado","category_id":1}'

# Obtener reporte
curl -X GET "http://127.0.0.1:8000/api/v1/budgets/reports/month?year=2025&month=9" \
     -H "Authorization: Bearer <TOKEN>"
```

## 📊 Características

### ✅ Implementado
- **Autenticación JWT** con registro y login
- **Gestión de Categorías** (ingresos y gastos)
- **Gestión de Transacciones** con fechas y notas
- **Reportes Mensuales** con cálculos automáticos
- **Documentación automática** con Swagger/OpenAPI
- **Base de datos SQLite** con relaciones
- **Validación de datos** con Pydantic
- **CORS habilitado** para desarrollo frontend

### 🔄 Por Implementar
- **Frontend Angular** completo
- **Gestión de Hábitos** avanzada
- **Gráficos y visualizaciones**
- **Exportación de datos** (PDF, Excel)
- **Modo oscuro**

## 🔧 Tecnologías

### Backend
- **FastAPI** - Framework web moderno para Python
- **SQLModel** - ORM moderno basado en SQLAlchemy y Pydantic
- **Pydantic** - Validación de datos y serialización
- **Uvicorn** - Servidor ASGI de alto rendimiento
- **SQLite** - Base de datos ligera
- **JWT** - Autenticación con tokens
- **bcrypt** - Hashing de contraseñas

### Frontend (Planificado)
- **Angular** - Framework frontend
- **TypeScript** - Lenguaje tipado
- **Angular Material** - Componentes UI
- **RxJS** - Programación reactiva

## 📝 Notas de Desarrollo

- El servidor automáticamente recarga cuando se detectan cambios (`--reload`)
- La base de datos se crea automáticamente al iniciar la aplicación
- Los tokens JWT expiran en 30 minutos por defecto
- Las contraseñas se almacenan hasheadas con bcrypt
- CORS está habilitado para `localhost:4200` (Angular dev server)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT

