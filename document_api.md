# 📘 Documentación API – Backend Spring

## 🟧 Colección en Postman
**URL:**  
https://nicomansolov89-8494190.postman.co/workspace/e34cf295-3d20-4735-bacf-2ceff3d4fc20/collection/49591320-ce23eadc-c257-419d-bbec-48b85cc9e85b

---

# 📚 Índice
1. [🔐 Login](#login)
2. [🟦 Categories](#categories)
3. [🟩 Subcategories](#subcategories)
4. [🟪 Products](#products)
5. [🟨 Users](#users)
6. [🟫 Stats](#stats)
7. [🌐 Endpoints REST Recomendados](#rest)

---

# 🔐 Login <a name="login"></a>

```http
POST /api/auth/login
```

### Headers
| Key | Value |
|-----|--------|
| Content-Type | application/json |

### Body
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Respuesta
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

# 🟦 Categories <a name="categories"></a>

## 📌 Endpoints
| Acción | Método | URL |
|--------|--------|-----|
| Crear categoría | POST | `/api/categories` |
| Listar categorías | GET | `/api/categories` |
| Ver por ID | GET | `/api/categories/{id}` |
| Actualizar | PUT | `/api/categories/{id}` |
| Eliminar | DELETE | `/api/categories/{id}` |

---

## ➕ Crear Categoría
```http
POST /api/categories
```

### Headers
| Key | Value |
|-----|--------|
| Authorization | Bearer TOKEN |
| Content-Type | application/json |

### Body
```json
{
  "name": "Hogar",
  "description": "Productos para el hogar en general",
  "active": true
}
```

---

## 📋 Listar Categorías
```http
GET /api/categories
```

### Headers
| Key | Value |
|-----|--------|
| Authorization | Bearer TOKEN |

---

## 🔍 Obtener Categoría por ID
```http
GET /api/categories/18
```

---

## ✏️ Actualizar Categoría
```http
PUT /api/categories/11
```

### Body
```json
{
  "name": "Herramientas",
  "description": "Productos de reparación",
  "active": true
}
```

---

## ❌ Eliminar Categoría
```http
DELETE /api/categories/11
```

---

# 🟩 Subcategories <a name="subcategories"></a>

## 📌 Endpoints
| Acción | Método | URL |
|--------|--------|-----|
| Crear subcategoría | POST | `/api/subcategories` |
| Listar subcategorías | GET | `/api/subcategories` |
| Ver por ID | GET | `/api/subcategories/{id}` |
| Actualizar | PUT | `/api/subcategories/{id}` |
| Eliminar | DELETE | `/api/subcategories/{id}` |

---

## ➕ Crear Subcategoría
```http
POST /api/subcategories
```

### Body
```json
{
  "name": "Taladros",
  "description": "Taladros en general",
  "active": true,
  "category": { "id": 18 }
}
```

---

## 📋 Listar Subcategorías
```http
GET /api/subcategories
```

---

## 🔍 Obtener Subcategoría por ID
```http
GET /api/subcategories/7
```

---

## ✏️ Actualizar Subcategoría
```http
PUT /api/subcategories/5
```

### Body
```json
{
  "name": "Martillos",
  "description": "Martillos en general",
  "active": true,
  "category": { "id": 13 }
}
```

---

## ❌ Eliminar Subcategoría
```http
DELETE /api/subcategories/4
```

---

# 🟪 Products <a name="products"></a>

## 📌 Endpoints
| Acción | Método | URL |
|--------|--------|-----|
| Crear producto | POST | `/api/products` |
| Listar por categoría | GET | `/api/products/category/{id}` |
| Listar por subcategoría | GET | `/api/products/subcategory/{id}` |
| Ver por ID | GET | `/api/products/{id}` |
| Actualizar | PUT | `/api/products/{id}` |
| Eliminar | DELETE | `/api/products/{id}` |

---

## ➕ Crear Producto
```http
POST /api/products
```

### Body
```json
{
  "name": "Mesa gamer Lucient",
  "description": "Mesa lucient de buenos acabados",
  "price": 330.99,
  "stock": 75,
  "active": true,
  "category": { "id": 18 },
  "subcategory": { "id": 7 }
}
```

---

## ✏️ Actualizar Producto
```http
PUT /api/products/1
```

### Body
```json
{
  "name": "Taladro Rotschild 23",
  "description": "Taladro hidráulico",
  "price": 330.99,
  "stock": 75,
  "active": true,
  "category": { "id": 13 },
  "subcategory": { "id": 6 }
}
```

---

## ❌ Eliminar Producto
```http
DELETE /api/products/1
```

---

# 🟨 Users <a name="users"></a>

## 📌 Endpoints
| Acción | Método | URL |
|--------|--------|-----|
| Crear usuario | POST | `/api/users` |
| Listar usuarios | GET | `/api/users` |
| Ver por ID | GET | `/api/users/{id}` |
| Actualizar | PUT | `/api/users/{id}` |
| Eliminar | DELETE | `/api/users/{id}` |

---

## ➕ Crear Usuario
```http
POST /api/users
```

### Body
```json
{
  "username": "nuevo_user",
  "password": "password123",
  "email": "nuevo@example.com",
  "role": "COORDINADOR",
  "active": true
}
```

---

## ❌ Eliminar Usuario
```http
DELETE /api/users/26
```

---

# 🟫 Stats <a name="stats"></a>

## 📊 Obtener estadísticas
```http
GET /api/stats
```

---

# 🌐 Endpoints REST Recomendados <a name="rest"></a>

| Acción | Método | URL |
|--------|--------|-----|
| Subcategorías por categoría | GET | `/api/categories/{id}/subcategories` |
| Productos por categoría | GET | `/api/categories/{id}/products` |
| Productos por subcategoría | GET | `/api/subcategories/{id}/products` |

---

# ✅ Documento completado
Versión estilizada lista para usar en GitHub.
