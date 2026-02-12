# Guía de Despliegue - PIX Camaras

Esta guía te ayudará a desplegar el proyecto en **Vercel** (frontend) y **Railway** (backend).

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Railway](https://railway.app)
- Repositorio Git (GitHub, GitLab, o Bitbucket)

## 🚀 Despliegue del Backend en Railway

### Paso 1: Crear proyecto en Railway

1. Ve a [Railway](https://railway.app) e inicia sesión
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub repo" (o tu proveedor Git)
4. Selecciona tu repositorio `PIX-CAMARAS`

### Paso 2: Configurar el servicio

1. Railway detectará automáticamente el `Dockerfile` o puedes configurarlo manualmente:
   - **Build Command**: (no necesario, usa Dockerfile)
   - **Start Command**: `node backend/index.js`
   - **Root Directory**: `/` (raíz del proyecto)

### Paso 3: Configurar Base de Datos PostgreSQL

1. En tu proyecto de Railway, haz clic en "+ New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará automáticamente una base de datos y la variable `DATABASE_URL`
4. La variable `DATABASE_URL` se inyectará automáticamente en tu servicio

### Paso 4: Configurar Variables de Entorno

En la pestaña "Variables" de tu servicio en Railway, agrega:

```
FRONTEND_URL=https://tu-proyecto.vercel.app
JWT_SECRET=tu-secret-key-super-segura-genera-una-aleatoria
NODE_ENV=production
```

**Importante**: 
- Reemplaza `tu-secret-key-super-segura-genera-una-aleatoria` con una clave secreta fuerte
- Puedes generar una con: `openssl rand -base64 32`
- `FRONTEND_URL` la actualizarás después de desplegar el frontend

### Paso 5: Obtener la URL del Backend

1. Una vez desplegado, Railway te dará una URL como: `https://tu-proyecto.up.railway.app`
2. **Copia esta URL** - la necesitarás para el frontend

## 🎨 Despliegue del Frontend en Vercel

### Paso 1: Conectar repositorio

1. Ve a [Vercel](https://vercel.com) e inicia sesión
2. Haz clic en "Add New..." → "Project"
3. Importa tu repositorio `PIX-CAMARAS`

### Paso 2: Configurar el proyecto

Vercel detectará automáticamente la configuración desde `vercel.json`, pero verifica:

- **Framework Preset**: Other
- **Root Directory**: `/` (raíz)
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`

### Paso 3: Configurar Variables de Entorno

En la sección "Environment Variables", agrega:

```
VITE_API_URL=https://tu-backend.railway.app
```

**Importante**: Reemplaza `https://tu-backend.railway.app` con la URL real de tu backend en Railway

### Paso 4: Desplegar

1. Haz clic en "Deploy"
2. Espera a que termine el build
3. Vercel te dará una URL como: `https://tu-proyecto.vercel.app`

### Paso 5: Actualizar CORS en Railway

1. Vuelve a Railway
2. Actualiza la variable `FRONTEND_URL` con la URL de Vercel:
   ```
   FRONTEND_URL=https://tu-proyecto.vercel.app
   ```
3. Railway reiniciará automáticamente el servicio

## ✅ Verificación

1. **Backend**: Visita `https://tu-backend.railway.app/tournaments` (debería devolver JSON o error de autenticación)
2. **Frontend**: Visita `https://tu-proyecto.vercel.app` (debería cargar la aplicación)

## 🔧 Solución de Problemas

### Error de CORS
- Verifica que `FRONTEND_URL` en Railway coincida exactamente con la URL de Vercel (sin barra final)
- Asegúrate de que el backend se haya reiniciado después de cambiar la variable

### Error de conexión a la base de datos
- Verifica que `DATABASE_URL` esté configurada en Railway
- Asegúrate de que el servicio PostgreSQL esté activo

### El frontend no puede conectar con el backend
- Verifica que `VITE_API_URL` esté configurada en Vercel
- Asegúrate de que la URL del backend sea accesible públicamente
- Verifica que no haya errores en la consola del navegador

### Build falla en Vercel
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel para más detalles

## 📝 Notas Adicionales

- **Base de datos**: Railway usa PostgreSQL en producción. El código detecta automáticamente `DATABASE_URL` y usa PostgreSQL si está disponible, o SQLite en desarrollo local.
- **Variables de entorno**: Nunca subas archivos `.env` al repositorio. Usa las variables de entorno de Vercel y Railway.
- **Actualizaciones**: Cada push a la rama principal desplegará automáticamente en ambos servicios.

## 🔐 Seguridad

- **JWT_SECRET**: Debe ser una cadena aleatoria y segura. Nunca la compartas públicamente.
- **CORS**: Está configurado para permitir solo el frontend especificado en `FRONTEND_URL`.
- **Helmet**: El backend usa Helmet para seguridad adicional.

