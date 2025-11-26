# Configuración de Google Calendar OAuth

Esta guía te ayudará a configurar la integración automática con Google Calendar para que los torneos se agreguen, actualicen y eliminen automáticamente.

## Pasos para configurar OAuth 2.0

### 1. Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el nombre del proyecto para referencia

### 2. Habilitar Google Calendar API

1. En el menú lateral, ve a **APIs y servicios** > **Biblioteca**
2. Busca "Google Calendar API"
3. Haz clic en **Habilitar**

### 3. Configurar pantalla de consentimiento OAuth

1. Ve a **APIs y servicios** > **Pantalla de consentimiento OAuth**
2. Selecciona **Externo** (a menos que tengas un workspace de Google Workspace)
3. Completa los campos requeridos:
   - **Nombre de la aplicación**: PixGolf Camaras
   - **Correo electrónico de soporte**: Tu email
   - **Logo** (opcional)
   - **Dominio de aplicación** (opcional)
4. Agrega tu email en **Usuarios de prueba** si la app está en modo de prueba
5. Haz clic en **Guardar y continuar**

### 4. Crear credenciales OAuth 2.0

1. Ve a **APIs y servicios** > **Credenciales**
2. Haz clic en **+ CREAR CREDENCIALES** > **ID de cliente OAuth 2.0**
3. Selecciona **Aplicación web** como tipo de aplicación
4. Configura:
   - **Nombre**: PixGolf Calendar Integration
   - **Orígenes de JavaScript autorizados**:
     - `http://localhost:5173` (para desarrollo)
     - Tu dominio de producción (ej: `https://tudominio.com`)
   - **URI de redirección autorizadas**:
     - `http://localhost:5173/oauth/callback` (para desarrollo)
     - `https://tudominio.com/oauth/callback` (para producción)
5. Haz clic en **Crear**
6. **Copia el Client ID** que se muestra (lo necesitarás después)

### 5. Configurar variables de entorno

1. Crea un archivo `.env` en la raíz del proyecto (basado en `.env.example`)
2. Agrega tu Client ID:

```env
VITE_GOOGLE_CLIENT_ID=117314177248-4tbao6dukgi7sfngd0824f39prhh8foo.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/oauth/callback
```

**Nota**:

- Para producción, cambia `VITE_GOOGLE_REDIRECT_URI` a tu dominio de producción
- El Client ID debe ser el que copiaste en el paso anterior

### 6. Reiniciar el servidor de desarrollo

Después de configurar las variables de entorno, reinicia el servidor de desarrollo:

```bash
npm run dev
```

## Uso

### Autenticación inicial

La primera vez que crees un torneo, se te pedirá que te autentiques con Google Calendar.

1. Se abrirá una ventana emergente para autenticarte
2. Selecciona la cuenta de Google que quieres usar
3. Otorga los permisos necesarios para acceder a tu calendario
4. Una vez autenticado, los eventos se crearán automáticamente

### Funcionalidades

Una vez autenticado:

- **Crear torneo**: Se crea automáticamente un evento en tu Google Calendar
- **Actualizar torneo**: El evento en Google Calendar se actualiza automáticamente
- **Eliminar torneo**: El evento se elimina automáticamente de tu Google Calendar

### Desconectar

Si quieres desconectar tu cuenta de Google Calendar, puedes limpiar los tokens almacenados desde la consola del navegador:

```javascript
localStorage.clear();
```

O desde la aplicación, puedes agregar un botón para desconectar (funcionalidad futura).

## Solución de problemas

### Error: "Google Client ID no configurado"

- Verifica que el archivo `.env` existe y tiene `VITE_GOOGLE_CLIENT_ID`
- Reinicia el servidor de desarrollo después de crear/modificar `.env`
- Verifica que el nombre de la variable comience con `VITE_`

### Error: "redirect_uri_mismatch"

- Verifica que la URI de redirección en `.env` coincida exactamente con la configurada en Google Cloud Console
- Asegúrate de incluir el protocolo (`http://` o `https://`)
- Verifica que no haya espacios o caracteres especiales

### El evento no se crea automáticamente

- Verifica que te hayas autenticado correctamente
- Revisa la consola del navegador para ver mensajes de error
- Verifica que la Google Calendar API esté habilitada en tu proyecto

### Tokens expirados

- Los tokens se renuevan automáticamente
- Si hay problemas, puedes limpiar los tokens y volver a autenticarte
- Los refresh tokens no expiran (a menos que revoques el acceso manualmente)

## Seguridad

- **Nunca** compartas tu Client ID en repositorios públicos
- Agrega `.env` a `.gitignore` (ya debería estar incluido)
- En producción, usa variables de entorno seguras proporcionadas por tu plataforma de hosting
