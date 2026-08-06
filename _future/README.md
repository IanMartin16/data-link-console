# Pendiente de backend

`auth.nextauth.ts.txt` es la config de NextAuth v5 lista para cuando core
exponga rutas de sesion. Para activarla:

1. Confirmar que endpoints de auth expone core.
2. `npm i next-auth@beta`
3. Mover el archivo a `lib/auth.ts` y ajustar las rutas del provider.
4. Recrear `app/api/auth/[...nextauth]/route.ts` con `export { GET, POST } from handlers`.
5. Envolver el root layout en `SessionProvider`.
6. Cambiar el hook de `AppShell`: `useApiKey()` -> `useSession()`.
7. Borrar `lib/api/apiKeyStore.ts` y quitar la inyeccion del header en `client.ts`.

Solo el paso 6 toca la UI. Ese es el punto de todo el diseno.
