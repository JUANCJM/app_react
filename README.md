# App React - Expo/React Native Template

Una aplicación de ejemplo con Expo/React Native que incluye un formulario conectado a un servidor backend Express con PostgreSQL.

## Estructura del Proyecto

```
app_react/
├── App.js                 # Componente principal de la app
├── src/
│   ├── components/
│   │   ├── Header.js      # Componente de cabecera
│   │   └── Form.js        # Formulario con validación
│   ├── screens/
│   │   ├── HomeScreen.js  # Pantalla de bienvenida
│   │   └── FormScreen.js  # Pantalla del formulario
│   ├── styles/
│   │   └── global.js      # Estilos globales
│   └── __tests__/
│       └── Form.test.js   # Tests del formulario
├── server/
│   ├── index.js           # Servidor Express
│   ├── db.js              # Conexión a PostgreSQL
│   └── migrations/
│       └── 001_create_submissions.sql
└── .github/
    └── workflows/
        └── ci.yml         # GitHub Actions CI
```

## Requisitos Previos

- Node.js >= 16.0.0
- npm o yarn
- PostgreSQL instalado y corriendo
- Expo CLI (opcional, pero recomendado): `npm install -g expo-cli`

## Configuración de la Base de Datos

### 1. Crear la base de datos

```bash
# Conectar a PostgreSQL como usuario postgres
psql -U postgres

# Crear la base de datos
CREATE DATABASE app_react_db;

# Salir de psql
\q
```

O en una sola línea:

```bash
psql -U postgres -c 'CREATE DATABASE app_react_db;'
```

### 2. Ejecutar la migración

```bash
psql -U postgres -d app_react_db -f server/migrations/001_create_submissions.sql
```

Esto creará la tabla `submissions` con los siguientes campos:
- `id` - Identificador único (serial)
- `name` - Nombre del usuario
- `email` - Email del usuario
- `message` - Mensaje enviado
- `created_at` - Timestamp de creación

## Configuración del Servidor

### Variables de Entorno

El servidor utiliza las siguientes variables de entorno (con valores por defecto para desarrollo):

| Variable      | Valor por defecto | Descripción           |
|---------------|-------------------|-----------------------|
| PGUSER        | postgres          | Usuario de PostgreSQL |
| PGPASSWORD    | 12345678          | Contraseña            |
| PGHOST        | localhost         | Host de la BD         |
| PGDATABASE    | app_react_db      | Nombre de la BD       |
| PGPORT        | 5432              | Puerto de PostgreSQL  |
| PORT          | 3000              | Puerto del servidor   |

### Levantar el servidor

```bash
cd server
npm install
npm run start
```

El servidor estará disponible en `http://localhost:3000`.

### Endpoints de la API

| Método | Endpoint           | Descripción                    |
|--------|-------------------|--------------------------------|
| GET    | /api/health       | Health check - devuelve 200 OK |
| POST   | /api/submissions  | Crear una nueva submission     |

#### POST /api/submissions

Request body:
```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

Response (201 Created):
```json
{
  "id": 1,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

## Configuración del Cliente (App React Native)

### Instalar dependencias

```bash
npm install
```

### Iniciar la aplicación

```bash
npm run start
```

Esto abrirá Expo DevTools en tu navegador. Puedes ejecutar la app en:
- **Android**: Presiona `a` o escanea el código QR con Expo Go
- **iOS**: Presiona `i` o escanea el código QR con Expo Go
- **Web**: Presiona `w`

### Configuración de la URL de API

La app detecta automáticamente la plataforma y configura la URL del servidor:

- **Android Emulator**: `http://10.0.2.2:3000` (mapea al localhost del host)
- **iOS Simulator**: `http://localhost:3000`
- **Dispositivo físico**: Debes modificar `App.js` y usar la IP local de tu máquina (ejemplo: `http://192.168.1.100:3000`)

Para encontrar tu IP local:
```bash
# En Linux/Mac
ip addr show | grep "inet " | grep -v 127.0.0.1

# En Windows
ipconfig
```

## Scripts Disponibles

### Cliente (raíz del proyecto)

| Script    | Comando               | Descripción                    |
|-----------|-----------------------|--------------------------------|
| start     | `npm run start`       | Inicia Expo                   |
| android   | `npm run android`     | Inicia en Android             |
| ios       | `npm run ios`         | Inicia en iOS                 |
| web       | `npm run web`         | Inicia en navegador           |
| test      | `npm test`            | Ejecuta tests con Jest        |
| lint      | `npm run lint`        | Ejecuta ESLint                |

### Servidor (carpeta server/)

| Script | Comando             | Descripción           |
|--------|---------------------|-----------------------|
| start  | `npm run start`     | Inicia el servidor    |
| dev    | `npm run dev`       | Inicia en modo dev    |

## Testing

### Ejecutar tests

```bash
npm test
```

### Ejecutar tests con cobertura

```bash
npm test -- --coverage
```

## CI/CD

El proyecto incluye un workflow de GitHub Actions (`.github/workflows/ci.yml`) que:

1. Se ejecuta en pushes y PRs a las ramas `main` y `migracionv1`
2. Instala dependencias (`npm ci`)
3. Ejecuta linter (`npm run lint`)
4. Ejecuta tests (`npm test`)

## Guía Rápida de Inicio

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/JUANCJM/app_react.git
   cd app_react
   ```

2. **Configurar PostgreSQL**
   ```bash
   psql -U postgres -c 'CREATE DATABASE app_react_db;'
   psql -U postgres -d app_react_db -f server/migrations/001_create_submissions.sql
   ```

3. **Iniciar el servidor**
   ```bash
   cd server
   npm install
   npm run start
   # El servidor estará en http://localhost:3000
   ```

4. **Iniciar el cliente** (en otra terminal)
   ```bash
   cd app_react  # volver a la raíz
   npm install
   npm run start
   ```

5. **Probar la app**
   - Abrir la app en emulador/dispositivo
   - Navegar al formulario
   - Completar y enviar el formulario
   - Verificar en la base de datos:
     ```bash
     psql -U postgres -d app_react_db -c 'SELECT * FROM submissions;'
     ```

## Notas de Seguridad

- Las credenciales incluidas en este README son solo para desarrollo local
- En producción, usar variables de entorno y no incluir credenciales en el código
- El cliente nunca se conecta directamente a PostgreSQL; siempre pasa por el backend

## Tecnologías Utilizadas

- **Frontend**: React Native, Expo SDK 51
- **Backend**: Node.js, Express
- **Base de datos**: PostgreSQL
- **Testing**: Jest, Testing Library
- **Linting**: ESLint
- **CI/CD**: GitHub Actions

## Licencia

ISC
