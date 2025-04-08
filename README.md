# Servidor en Bun y Hono con Drizzle ORM y Turso DB

Este proyecto es un servidor en Bun y Hono que utiliza Drizzle ORM para interactuar con una base de datos Turso DB.

## Rutas Disponibles

- `POST /api/v1/auth/register`: Registra un nuevo usuario y envía el correo de verificación.

- `POST /api/v1/auth/login`: Inicia sesión y devuelve un token JWT.

- `POST /api/v1/auth/verify`: Verifica la cuenta de un usuario mediante un token.

- `---- /api/v1/posts`: Rutas protegidas por token de autenticación JWT.

## Configuración

1. Clona este repositorio en tu máquina local.

2. Instala Bun si no lo tienes. Puedes hacerlo siguiendo las [instrucciones de instalación.](https://bun.sh/docs/installation).

3. Crea un archivo `.env` en la raíz del proyecto y añade las variables de entorno necesarias.

   - `TURSO_CONNECTION_URL`: URL de conexión a la base de datos [Turso DB](https://turso.tech/).

   - `TURSO_AUTH_TOKEN`: Token de autenticación de la base de datos [Turso DB](https://turso.tech/).

   - `RESEND_API_KEY`: API KEY de [Resend](https://resend.com/).

   - `JWT_SECRET`: Palabra secreta para firmar el token JWT.

4. Ejecuta el siguiente comando para instalar las dependencias:

```
bun install
```

5. Ejecuta el siguiente comando para iniciar el servidor:

```
bun run dev
```

## Uso

El servidor se ejecutará en `http://localhost:3000`.

Puedes hacer solicitudes a las rutas definidas en el archivo `src/server.ts`.
