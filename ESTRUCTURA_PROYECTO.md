# Guía de Estructura del Proyecto Refactorizado

## 📁 Nueva Estructura

```
frontend/
├── src/
│   ├── components/                 # Componentes reutilizables
│   │   ├── AgentCard/
│   │   │   ├── AgentCard.jsx       # Componente presentacional
│   │   │   └── index.js            # Exportador
│   │   ├── MetricBox/
│   │   │   ├── MetricBox.jsx
│   │   │   └── index.js
│   │   ├── ScoreWeights/
│   │   │   ├── ScoreWeights.jsx
│   │   │   └── index.js
│   │   └── APITester/
│   │       ├── APITester.jsx
│   │       └── index.js
│   │
│   ├── pages/                      # Páginas/Vistas principales
│   │   └── Dashboard/
│   │       ├── Dashboard.jsx       # Componente contenedor
│   │       └── index.js
│   │
│   ├── hooks/                      # Custom Hooks
│   │   ├── useMetrics.js           # Gestiona métricas
│   │   ├── useFeedback.js          # Gestiona estado de feedback
│   │   └── index.js                # Exportador centralizado
│   │
│   ├── utils/                      # Utilidades
│   │   ├── constants.js            # Constantes y configuración
│   │   ├── formatting.js           # Funciones de formateo
│   │   └── api.js                  # Funciones de API
│   │
│   ├── styles/                     # Estilos CSS
│   │   ├── globals.css             # Estilos globales
│   │   ├── components.css          # Estilos de componentes
│   │   └── animations.css          # Animaciones
│   │
│   ├── App.jsx                     # Componente raíz
│   └── main.jsx                    # Punto de entrada
│
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Principios Aplicados

### 1. **Separación de Responsabilidades**
- **Componentes**: Solo presentación (JSX)
- **Hooks**: Lógica de estado y efectos
- **Utils**: Funciones puras y utilidades
- **Styles**: Estilos separados por tema

### 2. **camelCase en Todo**
```javascript
// ✅ Correcto
const agentConfigs = []
const formatToPercentage = () => {}
const useMetrics = () => {}
const dashboardRoot = {}

// ❌ Evitar
const AgentConfigs = []
const formattopercentage = () => {}
const formatToPercentage_v2 = () => {}
```

### 3. **Componentes Funcionales**
- Todos los componentes usan React Functional Components
- Uso extensivo de Hooks
- Props bien tipadas con JSDoc

### 4. **Reutilización**
```javascript
// ✅ Componentes reutilizables
<MetricBox value={42} label="evaluados" />
<AgentCard {...agentConfig} onEvaluate={handler} />

// ❌ Evitar
<div>42 evaluados</div> // Repetido en varios lugares
```

## 📚 Cómo Usar

### Importar Componentes
```javascript
// ✅ Forma recomendada (más limpio)
import Dashboard from "./pages/Dashboard/index.js";
import AgentCard from "./components/AgentCard/index.js";

// También válido
import Dashboard from "./pages/Dashboard";
import AgentCard from "./components/AgentCard";
```

### Importar Hooks
```javascript
import { useMetrics, useFeedback } from "./hooks/index.js";

const { metrics, isFlashing } = useMetrics();
const { feedbackData, updateFeedbackField } = useFeedback();
```

### Importar Utilidades
```javascript
import { agentConfigs, scoreWeightConfigs } from "./utils/constants.js";
import { formatToPercentage, formatMetric } from "./utils/formatting.js";
import { fetchMetrics, submitInteractionFeedback } from "./utils/api.js";
```

## 🔄 Flujo de Datos

```
App.jsx
└── Dashboard.jsx (Página principal)
    ├── useMetrics() → Obtiene datos en tiempo real
    ├── useFeedback() → Gestiona formulario
    │
    ├── AgentCard ← Recibe props
    │   └── onClick → updateFeedbackField()
    │
    ├── MetricBox ← Recibe valor del hook
    │
    ├── ScoreWeights ← Recibe configuración
    │
    └── APITester ← Recibe estado + handlers
        └── onSubmit → handleSubmitFeedback()
```

## 🚀 Mejoras Aplicadas

### Antes (Monolítico)
```javascript
// 500+ líneas de código
// Estilos inline en el componente
// Todo mezclado
export default function DashboardRealtime() { ... }
```

### Después (Modular)
```javascript
// Componentes: 30-100 líneas c/u
// Estilos: Separados en CSS
// Lógica: En hooks y utils
// Fácil de mantener y testear
export default Dashboard;
```

## 📋 Checklist para Nuevas Features

- [ ] Crear componente en `/components` si es reutilizable
- [ ] Crear hook en `/hooks` si tiene lógica compleja
- [ ] Usar camelCase para variables y funciones
- [ ] Documentar con JSDoc
- [ ] Separar estilos en CSS cuando sea posible
- [ ] Importar desde `/index.js` cuando exista

## 🧪 Ejemplo: Agregar Nuevo Componente

```javascript
// 1. Crear archivo: src/components/NewComponent/NewComponent.jsx
function NewComponent({ title, value, onChange }) {
  return <div>{title}: {value}</div>;
}
export default NewComponent;

// 2. Crear: src/components/NewComponent/index.js
import NewComponent from "./NewComponent.jsx";
export default NewComponent;

// 3. Usar en Dashboard:
import NewComponent from "../../components/NewComponent/index.js";

// En el JSX:
<NewComponent title="Test" value={42} onChange={handler} />
```

## 🎨 Variables CSS Disponibles

```css
--primary: #0284c7;
--primary-light: #06b6d4;
--secondary: #0f172a;
--text-dark: #1a202c;
--text-light: #475569;
--bg-light: #f0f9ff;
--shadow-md: 0 8px 32px rgba(0, 0, 0, 0.08);
--transition: all 0.2s ease;
```

Úsalas en tus estilos:
```css
.myComponent {
  color: var(--primary);
  box-shadow: var(--shadow-md);
  transition: var(--transition);
}
```

## 📖 Recursos

- **React Hooks**: https://react.dev/reference/react/hooks
- **Naming Conventions**: camelCase para variables/funciones, PascalCase para componentes
- **CSS Variables**: Definidas en `globals.css`
- **JSDoc**: Usa comentarios para documentar funciones

---

**¡Proyecto refactorizado con buenas prácticas profesionales!** 🎉
