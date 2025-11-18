# documentacion_api.md

## 🟧 **Colección en Postman**

Puedes acceder a la colección aquí:  
**https://nicomansolov89-8494190.postman.co/workspace/e34cf295-3d20-4735-bacf-2ceff3d4fc20/collection/49591320-ce23eadc-c257-419d-bbec-48b85cc9e85b**

---

# 🔐 Login

### POST – Login
`POST http://localhost:8080/api/auth/login`

**Headers**
```
Content-Type: application/json
```

**Body**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

# Categories

## Crear Categoría
`POST http://localhost:8080/api/categories`

**Headers**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json
```

**Body**
```json
{
  "name": "Hogar",
  "description": "Productos para el hogar en general",
  "active": true
}
```

---

## Listar Categorías
`GET http://localhost:8080/api/categories`

**Headers**
```
Authorization: Bearer <TOKEN>
```

---

## Obtener Categoría por ID
`GET http://localhost:8080/api/categories/18`

**Headers**
```
Authorization: Bearer <TOKEN>
```

---

## Actualizar Categoría
`PUT http://localhost:8080/api/categories/11`

**Headers**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Body**
```json
{
  "name": "Herramientas",
  "description": "Productos de reparación",
  "active": true
}
```

---

## Eliminar Categoría
`DELETE http://localhost:8080/api/categories/11`

**Headers**
```
Authorization: Bearer <TOKEN>
```

---

## (Recomendado REST)
`GET http://localhost:8080/api/categories/18/subcategories`

---

# Subcategories

## Crear Subcategoría
`POST http://localhost:8080/api/subcategories`

**Headers**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Body**
```json
{
  "name": "Taladros",
  "description": "Taladros en general",
  "active": true,
  "category": { "id": 18 }
}
```

---

## Listar Subcategorías
`GET http://localhost:8080/api/subcategories`

**Headers**
```
Authorization: Bearer <TOKEN>
```

---

## Obtener Subcategoría por ID
`GET http://localhost:8080/api/subcategories/7`

**Headers**
```
Authorization: Bearer <TOKEN>
```

---

## Actualizar Subcategoría
`PUT http://localhost:8080/api/subcategories/5`

**Headers**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Body**
```json
{
  "name": "Martillos",
  "description": "Martillos en general",
  "active": true,
  "category": { "id": 13 }
}
```

---

## Eliminar Subcategoría
`DELETE http://localhost:8080/api/subcategories/4`

**Headers**
```
Authorization: Bearer <TOKEN>
```

---

## (Recomendado REST)
`GET http://localhost:8080/api/categories/{id}/subcategories`

---

# Products

## Listar Productos por Categoría
`GET http://localhost:8080/api/products/category/18`

---

## Listar Productos por Subcategoría
`GET http://localhost:8080/api/products/subcategory/7`

---

## Obtener Producto por ID
`GET http://localhost:8080/api/products/1`

---

## Crear Producto
`POST http://localhost:8080/api/products`

**Headers**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Body**
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

## Actualizar Producto
`PUT http://localhost:8080/api/products/1`

**Headers**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Body**
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

## Eliminar Producto
`DELETE http://localhost:8080/api/products/1`

**Headers**
```
Authorization: Bearer <TOKEN>
```

---

## (Recomendado REST)
`GET http://localhost:8080/api/categories/{id}/products`
`GET http://localhost:8080/api/subcategories/{id}/products`

---

# Users

## Listar Usuarios
`GET http://localhost:8080/api/users`

---

## Obtener Usuario por ID
`GET http://localhost:8080/api/users/22`

---

## Crear Usuario
`POST http://localhost:8080/api/users`

**Headers**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Body**
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

## Actualizar Usuario
`PUT http://localhost:8080/api/users/22`

**Headers**
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

---

## Eliminar Usuario
`DELETE http://localhost:8080/api/users/26`

**Headers**
```
Authorization: Bearer <TOKEN>
```

---

# Stats

## Obtener estadísticas
`GET http://localhost:8080/api/stats`

