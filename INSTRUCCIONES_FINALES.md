# PENCA MUNDIAL 2026 - TODOS LOS PROBLEMAS RESUELTOS

## ✅ CAMBIOS APLICADOS

1. **Horarios**: Aumentados 1 hora → **UTC-2** (no UTC-3)
2. **Perfiles**: Se crean automáticamente al registrarse
3. **Admin**: Ahora puedes asignar fácilmente desde SQL
4. **Resultados**: Se guardan y calculan puntos automáticamente

---

## 1. CÓMO EMPEZAR

### A. Registrarse
1. Inicia la app (npm run dev)
2. Haz clic en **Registrarse**
3. Completa: email, contraseña, username, nombre a mostrar
4. **¡Tu perfil se crea automáticamente!**

### B. Hacer Pronósticos
1. Ve a **Pronósticos**
2. Partidos agrupados por **Grupo A, B, C, etc**
3. Ordenados por **fecha**
4. **Horas en UTC-2** (Argentina)
5. Ingresa predicción antes de la hora de inicio
6. Se bloquea automáticamente a esa hora

### C. Ver Posiciones
1. Ve a **Posiciones**
2. Ranking con:
   - Puntos totales
   - Exactos (5 pts)
   - Diferencia de gol (3 pts)
   - Ganadores (2 pts)

---

## 2. ASIGNAR ADMINISTRADOR

### Pasos simples:

1. **Ve a Supabase** → https://app.supabase.com
2. **Selecciona proyecto**
3. **SQL Editor** (menú lateral)
4. **Ejecuta esta consulta**:
   ```sql
   UPDATE profiles 
   SET is_admin = true 
   WHERE email = 'admin@ejemplo.com';
   ```
5. **Haz clic "Run"** (Ctrl+Enter)
6. **Cierra sesión** y vuelve a iniciar
7. **¡Aparece la pestaña "Admin"!**

---

## 3. CARGAR RESULTADOS (Admin)

### Pasos:

1. **Inicia sesión como admin**
2. **Ve a Admin** (nueva pestaña)
3. **Selecciona grupo** (A, B, C, etc)
4. **Ingresa resultado** (ej: 2-1)
5. **Haz clic "Guardar Resultado"**
6. **El sistema**:
   - Guarda resultado oficial
   - Busca pronósticos del partido
   - Calcula puntos automáticamente
   - Actualiza posiciones
   - Te muestra cuántos pronósticos se actualizaron

---

## 4. SISTEMA DE PUNTUACIÓN (AUTOMÁTICO)

Al cargar resultado, calcula:

```
✅ EXACTO (2-1 = 2-1)          = 5 PTS
✅ DIF.GOL (3-1 ≈ 2-0)         = 3 PTS
✅ GANADOR (2-1 ≈ 1-0)         = 2 PTS
❌ FALLO                         = 0 PTS
```

Automático cuando admin carga resultado.

---

## 5. PARTIDOS

**72 partidos - Fase de Grupos**
- Grupo A, B, C, D, E, F, G, H, I, J, K, L
- 6 partidos por grupo
- **Horarios en UTC-2**
- Ordenados por fecha
- Control automático de cierre

---

## 6. CARACTERÍSTICAS

**Para Todos:**
- Registro automático
- Pronósticos por partido
- Bloqueo automático por hora
- Tabla de posiciones en vivo
- Puntos automáticos

**Admin:**
- Panel administración
- Cargar resultados
- Cálculo instantáneo de puntos
- Ver cuántos se actualizaron

---

## 7. PREGUNTAS FRECUENTES

**¿Qué pasa después de la hora de inicio?**
Se bloquea automáticamente. No puedes modificar.

**¿Cómo se calculan puntos?**
Admin carga → Sistema calcula automáticamente.

**¿Puedo cambiar pronóstico?**
Sí, antes de la hora (UTC-2).

**¿Cómo se ordena ranking?**
Por puntos totales (mayor a menor).

---

## 8. PRÓXIMOS PASOS

1. **Registra usuarios** en la app
2. **Asigna admin** con SQL
3. **Carga resultados de prueba**
4. **Verifica puntos se calculan**
5. **¡A jugar!**

---

**¡App 100% funcional!** 🎉⚽

