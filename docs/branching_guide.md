# Guía de Ramas (Branching Strategy)

Para mantener un flujo de trabajo ordenado y despliegues seguros en Vercel y Railway, utilizaremos la siguiente estructura de ramas.

## Ramas Principales

### 1. `master` (Producción)
- **Estado**: Siempre debe contener código estable y listo para producción.
- **Despliegue**: Se despliega automáticamente a la URL principal de **Vercel** y la base de datos de producción de **Railway**.
- **Regla**: **NUNCA** hagas commits directamente en `master`. Todos los cambios deben entrar vía Pull Request desde `develop`.

### 2. `develop` (Desarrollo / Staging)
- **Estado**: Rama de integración donde se consolidan las funcionalidades antes de pasar a producción.
- **Despliegue**: Recomendado para entornos de **Staging** o **Previsualización**.
- **Regla**: Es la rama base para crear nuevas funcionalidades (`feature/`).

## Flujo de Trabajo

### Crear una funcionalidad
1. Asegúrate de estar en `develop`: `git checkout develop` e `git pull origin develop`.
2. Crea una rama descriptiva: `git checkout -b feature/nombre-de-la-tarea`.
3. Trabaja en tus cambios y haz commits.

### Integrar cambios
1. Sube tu rama: `git push origin feature/nombre-de-la-tarea`.
2. Abre un **Pull Request** de tu rama hacia `develop` en GitHub.
3. Una vez aprobado y probado, se mezcla en `develop`.

### Pasar a Producción
1. Cuando `develop` tenga suficientes cambios estables, abre un **Pull Request** de `develop` hacia `master`.
2. Al mezclar en `master`, se disparará el despliegue automático a producción.
