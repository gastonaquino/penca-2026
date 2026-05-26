# PENCA MUNDIAL 2026 - ESTADO ACTUAL

## ✅ PROBLEMAS RESUELTOS

### 1. Horarios (UTC-3) ✅
- **72 partidos** con horarios correctamente convertidos a **UTC-3**
- Ejemplo: México 13:00 UTC-6 → 22:00 UTC-3 ✓
- Todos los horarios del JSON original convertidos correctamente

### 2. Base de Datos ✅
- **matches**: 72 registros (solo fase de grupos)
- **profiles**: 0 registros (esperando usuarios)
- **predictions**: 0 registros (esperando usuarios)

---

## 📱 CÓMO USAR LA APP

### Paso 1: Registrar Primer Usuario
1. Abre la app
2. Ve a **Registrarse**
3. Completa el formulario:
   - Email: cualquiera (ej: test@test.com)
   - Contraseña: mínimo 6 caracteres
   - Username: nombre de usuario
   - Display Name: nombre a mostrar
4. Haz clic en **Registrar**
5. **¡El perfil se crea automáticamente en la tabla profiles!**

### Paso 2: Verificar que el Perfil se Creó
1. Ve a Supabase Dashboard
2. Table Editor → profiles
3. Deberías ver 1 registro con tu usuario
4. Puedes hacer admin con:
```sql
UPDATE profiles SET is_admin = true WHERE email = 'tu-email@test.com';
```

### Paso 3: Iniciar Sesión y Probar
1. Cierra sesión si estás logueado
2. Vuelve a iniciar sesión con el mismo email/contraseña
3. Ve a **Pronósticos**
4. Verás los 72 partidos con horarios en UTC-3

---

## 🔧 ESTRUCTURA DE DATOS

### Tabla `matches` (72 registros)
```
- group_name: Group A, Group B, ..., Group L
- home_team: Equipo local
- away_team: Equipo visitante
- kickoff_time: Fecha/hora en UTC (representando UTC-3)
- home_score: null (sin cargar)
- away_score: null (sin cargar)
```

### Tabla `profiles` (se crea al registrar)
```
- id: UUID del usuario
- username: Nombre de usuario único
- display_name: Nombre a mostrar
- is_admin: false por defecto
- created_at: Fecha de creación
```

### Tabla `predictions` (se crea al hacer pronósticos)
```
- user_id: ID del usuario
- match_id: ID del partido
- home_score: Resultado pronosticado (local)
- away_score: Resultado pronosticado (visitante)
- points: 0 (se calcula al cargar resultado)
```

---

## 👤 CÓMO CONVERTIR A ADMIN

### Ya con usuarios registrados:
```sql
UPDATE profiles
SET is_admin = true
WHERE email = 'email-del-usuario@test.com';
```

### Si no hay usuarios:
1. **Primero** regístrate en la app
2. **Luego** ejecuta el SQL en Supabase
3. Cierra sesión y vuelve a iniciar
4. Verás la pestaña **Admin**

---

## ⚽ FUNCIONALIDADES

### Para Usuarios Regulares:
- ✅ Ver 72 partidos agrupados por grupo
- ✅ Horarios en UTC-3
- ✅ Hacer pronósticos antes de la hora de inicio
- ✅ Ver tabla de posiciones
- ✅ Bloqueo automático a la hora de inicio

### Para Admins:
- ✅ Cargar resultados por grupo
- ✅ Calcular puntos automáticamente
- ✅ Ver cuántos pronósticos se actualizaron

---

## 🧪 PRUEBA RÁPIDA

1. **Regístrate** con cualquier email
2. **Ve a Supabase** → Table Editor → profiles
3. **Verifica** que hay 1 registro
4. **Haz admin**:
   ```sql
   UPDATE profiles SET is_admin = true WHERE id = (SELECT id FROM profiles LIMIT 1);
   ```
5. **Cierra sesión** y vuelve a entrar
6. **Ve a Admin** y carga resultados de prueba
7. **Ve a Pronósticos** y verifica puntos

---

## 📊 ESTADO ACTUAL

| Tabla | Registros | Estado |
|-------|-----------|--------|
| matches | 72 | ✅ Correcto |
| profiles | 0 | ⏳ Esperando registros |
| predictions | 0 | ⏳ Esperando pronósticos |

---

## ❓ PREGUNTAS FRECUENTES

**¿Por qué profiles está vacío?**
Porque aún no hay usuarios registrados. Se llena automáticamente al registrarse.

**¿Cómo registro un usuario?**
Ve a la app → Registrarse → Completa el formulario.

**¿El perfil se crea solo?**
Sí, automáticamente cuando te registras.

**¿Cómo hago admin?**
Después de registrarte, ejecuta SQL en Supabase:
```sql
UPDATE profiles SET is_admin = true WHERE email = 'tu-email@test.com';
```

**¿Los horarios están bien?**
Sí, convertidos de UTC-4, UTC-5, UTC-6, UTC-7 a UTC-3.

---

## 🚀 PRÓXIMOS PASOS

1. **Regístrate** en la app
2. **Verifica** que profiles tenga 1 registro
3. **Hazte admin** con SQL
4. **Cuenta a amigos** que se registren
5. **Carga resultados** de algunos partidos
6. **Verifica** que los puntos se calculen

---

**¡Todo está listo! Solo falta que alguien se registre** 🎉⚽
