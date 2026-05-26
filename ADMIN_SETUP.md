# Configuración de Administrador - PENCA MUNDIAL 2026

## ¿Cómo asignar un usuario como administrador?

### Método 1: A través de Supabase SQL Editor (Recomendado)

1. **Ve a tu proyecto Supabase**
   - Accede a https://app.supabase.com
   - Selecciona tu proyecto

2. **Abre SQL Editor**
   - En el menú lateral, haz clic en **SQL Editor**

3. **Ejecuta esta consulta**
   ```sql
   UPDATE profiles 
   SET is_admin = true 
   WHERE email = 'tu-email@ejemplo.com';
   ```
   
   **O si prefieres por username:**
   ```sql
   UPDATE profiles 
   SET is_admin = true 
   WHERE username = 'tu_usuario';
   ```

4. **Confirma los cambios**
   - Haz clic en **Run** o presiona `Ctrl+Enter`
   - Deberías ver "1 row updated"

5. **Recarga la app**
   - Cierra sesión y vuelve a iniciar
   - Ahora verás la pestaña "Admin" en la barra de navegación

---

## ¿Qué puede hacer un administrador?

### Panel de Administrador
- ✅ Ver todos los partidos agrupados por grupo
- ✅ Cargar resultados finales de cada partido
- ✅ Calcular automáticamente puntos de todos los pronósticos
- ✅ Ver cuántos pronósticos se actualizaron

### Flujo de Carga de Resultados

1. **Ve al Panel de Admin**
2. **Selecciona un grupo** (Group A, Group B, etc)
3. **Ingresa el resultado** en los campos de entrada
4. **Haz clic en "Guardar Resultado"**
5. **Sistema automáticamente**:
   - Guarda el resultado oficial del partido
   - Busca todos los pronósticos para ese partido
   - Calcula puntos para cada pronóstico
   - Actualiza la tabla de posiciones

---

## Sistema de Puntuación (Automático)

Una vez que cargas un resultado, el sistema calcula:

| Pronóstico | Resultado | Puntos |
|-----------|-----------|--------|
| 2-1 | 2-1 | 5 (exacto) |
| 3-1 | 2-0 | 3 (dif. gol) |
| 2-1 | 1-0 | 2 (ganador) |
| 1-0 | 2-1 | 0 (fallo) |

---

## Instrucciones paso a paso en Supabase

### Paso 1: Abrir SQL Editor
```
Supabase Dashboard → SQL Editor → New Query
```

### Paso 2: Copiar y pegar
```sql
-- Para convertir a admin por email (reemplaza "admin@ejemplo.com")
UPDATE profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@ejemplo.com');
```

### Paso 3: Ejecutar
- Presiona `Ctrl+Enter` o haz clic en **Run**

### Paso 4: Verificar
- Deberías ver "1 row updated"
- Si ves "0 rows updated", verifica que el email sea exacto

---

## Solución de Problemas

### No aparece la pestaña Admin después de actualizar
- Cierra completamente la sesión (haz clic en logout)
- Cierra el navegador o limpia el caché
- Vuelve a iniciar sesión

### Error al cargar resultados
- Verifica que haya ingresado dos números válidos (0-99)
- Asegúrate de que el partido no haya sido cargado 2 veces
- Revisa la consola del navegador para más detalles

### ¿Cómo deshacer cambios?
```sql
-- Para remover admin de un usuario
UPDATE profiles 
SET is_admin = false 
WHERE username = 'nombre_usuario';
```

---

## Notas Importantes

⚠️ **Seguridad**: Solo asigna admin a personas de confianza
⚠️ **Datos**: Los resultados no se pueden modificar después de cargarlos (por ahora)
⚠️ **Puntos**: Se calculan automáticamente al guardar el resultado
