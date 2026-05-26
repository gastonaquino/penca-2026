# Configuración de Penca Mundial 2026

## Pasos para activar la base de datos

### 1. Ejecutar la migración SQL

1. Ve a tu proyecto Supabase: https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a la sección **SQL Editor**
4. Crea una nueva consulta
5. Copia el contenido del archivo `MIGRATION.sql`
6. Ejecuta la migración

### 2. Verificar que se crearon las tablas

La migración crea:
- **profiles**: Perfiles de usuarios (linked a auth.users)
- **matches**: Partidos del Mundial con horarios en UTC-3
- **predictions**: Pronósticos de cada usuario por partido

Y automáticamente inserta los 72 partidos de la fase de grupos.

## Sistema de Puntuación

- **Resultado exacto**: 5 puntos (ej: predice 2-1 y es 2-1)
- **Diferencia de gol correcta**: 3 puntos (ej: predice 3-1 y es 2-0)
- **Ganador/empate correcto**: 2 puntos (ej: predice 2-1 y es 1-0)
- **Fallo**: 0 puntos

## Características Principales

✅ Autenticación con email/contraseña
✅ Pronósticos por partido (antes de la hora de inicio)
✅ Tabla de posiciones con ranking
✅ Sistema de puntuación automático
✅ RLS para privacidad de datos
✅ 72 partidos cargados (Fase de Grupos)
✅ Horarios convertidos a UTC-3 (Zona horaria Argentina)

## Próximas fases a cargar

Los partidos de knockout (Round of 32, Round of 16, Quarter-final, Semi-final, Final) 
se pueden agregar cuando estén disponibles los datos exactos.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build para producción

```bash
npm run build
```
