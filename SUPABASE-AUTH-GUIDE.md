# Guía de Autenticación con Supabase

## ✅ Estado: COMPLETAMENTE CONFIGURADO Y FUNCIONAL

El sistema de autenticación con Supabase está completamente implementado y listo para usar.

## 🔐 Configuración

### Variables de Entorno (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://warsrhhanfmujkewgytm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**✅ Ya configurado** - Las credenciales están activas y conectadas al proyecto "vocatonic".

## 📊 Arquitectura de Base de Datos

### Tablas Principales

#### 1. `auth.users` (Gestionada por Supabase)
- Tabla del sistema de autenticación de Supabase
- Almacena credenciales, tokens, sesiones
- **No modificar directamente**

#### 2. `public.users` (Tu tabla de perfiles)
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
- Vinculada a `auth.users` mediante foreign key
- Se crea automáticamente cuando un usuario se registra (trigger)
- **RLS habilitado** ✅

#### 3. `public.onboarding`
- Almacena datos del proceso de onboarding
- **RLS habilitado** ✅
- Los usuarios solo pueden ver/editar sus propios datos

#### 4. `public.user_settings`
- Configuraciones de usuario
- **RLS habilitado** ✅
- Los usuarios solo pueden ver/editar sus propias configuraciones

## 🔒 Seguridad (Row Level Security)

### ✅ Políticas RLS Activas

Todas las tablas públicas tienen RLS habilitado con políticas que garantizan:

1. **Usuarios solo acceden a sus propios datos**
2. **Autenticación requerida** para todas las operaciones
3. **Aislamiento de datos** entre usuarios

### Ejemplo de Política:
```sql
-- Los usuarios solo pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);
```

## 🚀 Funciones Disponibles

### Desde el Cliente (`lib/auth-client.ts`)

#### 1. `registerUser(email, password, name)`
```typescript
import { registerUser } from "@/lib/auth-client"

const result = await registerUser(
  "usuario@example.com",
  "password123",
  "Juan Pérez"
)
// { success: true, user: {...}, session: {...} }
```

**Qué hace:**
- Crea usuario en `auth.users`
- Trigger automático crea perfil en `public.users`
- Inicia sesión automáticamente
- Devuelve sesión activa

#### 2. `loginUser(email, password)`
```typescript
import { loginUser } from "@/lib/auth-client"

const result = await loginUser(
  "usuario@example.com",
  "password123"
)
// { success: true, user: {...}, session: {...} }
```

#### 3. `logoutUser()`
```typescript
import { logoutUser } from "@/lib/auth-client"

await logoutUser()
// Cierra sesión y limpia localStorage
```

#### 4. `getCurrentUser()`
```typescript
import { getCurrentUser } from "@/lib/auth-client"

const user = await getCurrentUser()
// { id, email, user_metadata: { name }, ... } o null
```

#### 5. `getSession()`
```typescript
import { getSession } from "@/lib/auth-client"

const session = await getSession()
// { access_token, refresh_token, user, ... } o null
```

#### 6. `onAuthStateChange(callback)`
```typescript
import { onAuthStateChange } from "@/lib/auth-client"

const { data: { subscription } } = onAuthStateChange((event, session) => {
  console.log('Auth event:', event) // SIGNED_IN, SIGNED_OUT, etc.
  console.log('Session:', session)
})

// Limpiar suscripción
subscription.unsubscribe()
```

## 📱 Uso en Componentes

### Ejemplo: Proteger una Página

```tsx
"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function ProtectedPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push("/login")
      } else {
        setUser(currentUser)
      }
      setLoading(false)
    }
    checkAuth()
  }, [router])

  if (loading) return <div>Cargando...</div>

  return <div>Bienvenido {user?.email}</div>
}
```

### Ejemplo: Verificar Autenticación en Tiempo Real

```tsx
"use client"

import { useEffect, useState } from "react"
import { onAuthStateChange } from "@/lib/auth-client"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <div>{isAuthenticated ? "Autenticado" : "No autenticado"}</div>
}
```

## 🔄 Flujo de Autenticación

### Registro:
1. Usuario ingresa email, password, nombre
2. `registerUser()` llama a `supabase.auth.signUp()`
3. Supabase crea usuario en `auth.users`
4. **Trigger automático** crea perfil en `public.users`
5. Sesión iniciada automáticamente

### Login:
1. Usuario ingresa email, password
2. `loginUser()` llama a `supabase.auth.signInWithPassword()`
3. Supabase valida credenciales
4. Devuelve sesión con tokens
5. Token almacenado automáticamente en localStorage

### Persistencia:
- Sesiones persisten en `localStorage` con clave `platanus-hack-session`
- Auto-refresh de tokens habilitado
- Al recargar página, sesión se restaura automáticamente

## 🛠️ Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `lib/supabase-browser.ts` | Cliente Supabase para el navegador |
| `lib/supabase-server.ts` | Cliente Supabase para el servidor |
| `lib/auth-client.ts` | Funciones de autenticación |
| `components/auth/auth-page.tsx` | UI de login/registro |
| `app/page.tsx` | Manejo de estado de autenticación |

## 🧪 Testing Manual

### 1. Verificar Configuración
```typescript
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

const client = getSupabaseBrowserClient()
console.log(client ? "✅ Cliente configurado" : "❌ Error")
```

### 2. Test de Registro
1. Ve a la página principal
2. Haz clic en "Crear Cuenta"
3. Ingresa email, password, nombre
4. Deberías estar autenticado automáticamente

### 3. Test de Login
1. Cierra sesión
2. Haz clic en "Iniciar Sesión"
3. Ingresa credenciales
4. Deberías entrar al dashboard

### 4. Test de Persistencia
1. Inicia sesión
2. Recarga la página (F5)
3. Deberías seguir autenticado

## 🐛 Troubleshooting

### Error: "Supabase client not initialized"
**Solución:** Verifica que `.env.local` tenga las variables correctas y reinicia el servidor.

```bash
pnpm dev
```

### Error: "Invalid credentials"
**Solución:** Verifica que el password tenga al menos 6 caracteres (requisito de Supabase).

### Error: "User already exists"
**Solución:** El email ya está registrado. Usa otro email o intenta iniciar sesión.

### Sesión no persiste después de recargar
**Solución:** 
1. Verifica que localStorage esté habilitado en tu navegador
2. Verifica que no estés en modo incógnito
3. Limpia cookies y vuelve a intentar

## 📚 Recursos Adicionales

- [Documentación Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)

## ✨ Características Implementadas

- ✅ Registro de usuarios
- ✅ Inicio de sesión
- ✅ Cierre de sesión
- ✅ Persistencia de sesiones
- ✅ Auto-refresh de tokens
- ✅ Row Level Security (RLS)
- ✅ Perfiles de usuario automáticos
- ✅ Protección de datos por usuario
- ✅ Suscripción a cambios de auth
- ✅ Manejo de errores robusto

## 🎯 Próximos Pasos (Opcionales)

1. **Confirmación de Email**: Configurar en Supabase Dashboard
2. **Reset de Password**: Implementar flujo de recuperación
3. **OAuth Providers**: Google, GitHub, etc.
4. **Multi-Factor Auth**: Añadir 2FA
5. **Roles y Permisos**: Sistema de roles avanzado

---

**Estado:** ✅ PRODUCCIÓN READY
**Última actualización:** 22 de Noviembre, 2025

