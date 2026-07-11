# BioInsight

Aplicación móvil de seguimiento de resultados clínicos creada con Expo y React Native.

## Cambios principales

El proyecto fue migrado desde una aplicación concentrada en `App.tsx` a una estructura modular basada en React Navigation.

- Se separó cada vista en su propia pantalla dentro de `src/screens`.
- Se incorporó un flujo de navegación para autenticación y onboarding.
- Se creó una navegación por pestañas para el área principal de la aplicación.
- Se organizaron componentes reutilizables, datos, estilos, tipos y tema dentro de `src`.

## Navegación implementada

La aplicación tiene dos niveles de navegación:

1. **Stack de acceso**
   - Onboarding: selección de intereses de salud.
   - Login: acceso simulado a la aplicación.
   - Main: entrada al área principal después de iniciar sesión.

2. **Pestañas principales**
   - Inicio: resumen del estado general y resultados recientes.
   - Historial: búsqueda y filtro de resultados clínicos.
   - Alertas: historial de alertas de salud.
   - Evolución: resumen visual de la evolución de glucosa.
   - Perfil: información de usuario y acciones de configuración.

## Mejoras visuales

- En **Historial**, los estados de resultado se muestran con badges de color:
  - Atención: rojo claro.
  - Precaución: amarillo claro.
  - Normal: verde claro.
- En **Alertas**, solo el indicador circular cambia de color según la prioridad:
  - Crítica: rojo.
  - Precaución: amarillo.
  - Informativa: azul.
- Se mantiene una barra inferior personalizada para las secciones principales.

## Estructura relevante

```text
src/
├── components/       # Componentes reutilizables
├── data/             # Datos de ejemplo
├── navigation/       # Stack, tabs y tipos de navegación
├── screens/          # Pantallas de autenticación y área principal
├── styles/           # Estilos por pantalla
├── theme/            # Colores, espaciado y radios
└── types/            # Tipos de TypeScript
```

## Ejecutar el proyecto

```bash
npm install
npx expo start
```

Si Expo Go no logra cargar la aplicación desde la red local, inicia Expo mediante túnel:

```bash
npx expo start --tunnel --clear
```

## Estado actual

Las pantallas y la navegación están implementadas con datos de ejemplo. Aún no hay autenticación real, persistencia de datos ni conexión con un backend.
