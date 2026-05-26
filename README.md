# PENCA MUNDIAL 2026

Aplicación completa de penca para el Mundial de Fútbol 2026 con React, TypeScript, Supabase y Tailwind CSS.

## Características

### ✅ Autenticación
- Registro e inicio de sesión con email/contraseña
- Perfiles de usuario automáticos
- Session management seguro

### ✅ Tabla de Posiciones
- Ranking en vivo de participantes
- Sistema de puntuación: 5 (exacto), 3 (dif. gol), 2 (ganador), 0 (fallo)
- Estadísticas detalladas (exactos, diferencia de gol, ganadores)
- Indicador visual del usuario actual

### ✅ Pronósticos
- Interfaz intuitiva para ingresar resultados
- Organización por ronda (Matchday 1-17)
- Bloqueo automático de partidos una vez comenzados
- Validación de resultados
- Guardado en tiempo real en Supabase

### ✅ Partidos Cargados
- 72 partidos de fase de grupos
- Horarios convertidos a UTC-3 (Zona horaria Argentina)
- Información completa: equipo, cancha, hora local

### 🎨 Diseño
- Tema rojo, verde y azul (colores del Mundial 2026)
- Interfaz moderna con glassmorphism
- Responsive (mobile, tablet, desktop)
- Logo oficial de PENCA
- Animaciones suaves

## Instalación

### Requisitos
- Node.js 18+
- npm o yarn
- Cuenta Supabase

### Pasos

1. **Instalar dependencias**
```bash
npm install
```

2. **Configurar Supabase**
- Crear proyecto en supabase.com
- Copiar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` al `.env`

3. **Ejecutar migración SQL**
- Abrir Supabase SQL Editor
- Copiar contenido de `MIGRATION.sql`
- Ejecutar

4. **Desarrollo**
```bash
npm run dev
```

5. **Build producción**
```bash
npm run build
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/
│   └── Navbar.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── supabase.ts
│   ├── types.ts
│   └── worldcup.ts
├── pages/
│   ├── AuthPage.tsx
│   ├── StandingsPage.tsx
│   └── PredictionsPage.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Sistema de Puntuación

| Resultado | Puntos | Ejemplo |
|-----------|--------|---------|
| Exacto | 5 | Predice 2-1, es 2-1 |
| Dif. Gol | 3 | Predice 3-1, es 2-0 |
| Ganador | 2 | Predice 2-1, es 1-0 |
| Fallo | 0 | Predice 1-0, es 2-1 |

## Base de Datos

### Tablas
- **profiles**: Usuarios autenticados
- **matches**: 72 partidos del Mundial 2026
- **predictions**: Pronósticos por usuario

### RLS (Row Level Security)
- Los usuarios solo ven sus propios pronósticos
- Pueden modificar hasta que comience el partido
- Acceso de lectura a otros perfiles

## Tecnologías

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Build**: Vite
- **Icons**: Lucide React

## Próximas mejoras

- [ ] Agregar partidos de knockout
- [ ] Sistema de notificaciones
- [ ] Compartir resultados en redes
- [ ] Modo ligero/oscuro
- [ ] Histórico de cambios de posición
- [ ] Logros/medallas especiales

## Licencia

Uso privado - Penca Mundial 2026
