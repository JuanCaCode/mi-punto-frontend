# Mi Punto – Frontend

## 📌 Descripción del proyecto

Mi Punto es una plataforma orientada a la gestión y visualización de negocios locales.  
Este repositorio contiene el **frontend del sistema**, encargado de la interfaz de usuario, experiencia visual y comunicación con el backend mediante API REST.

---

## 🚀 Tecnologías utilizadas

- **React + Vite** → Desarrollo de la interfaz de usuario  
- **Tailwind CSS** → Estilos modernos y rápidos  
- **shadcn/ui** → Componentes reutilizables y accesibles  
- **Jotai** → Manejo de estado global y persistencia  
- **PostCSS** → Procesamiento de estilos  

---

## 🧠 Arquitectura

El proyecto sigue una **arquitectura monolítica modular**, organizada por funcionalidades.

Se aplica el enfoque de **Screaming Architecture**, donde la estructura del proyecto refleja directamente los módulos del negocio.

---

## 📦 Módulos principales

- **auth** → Autenticación de usuarios  
- **business** → Gestión y visualización de negocios  
- **reviews** → Sistema de reseñas  

Cada módulo puede contener:

- `pages/` → Pantallas principales  
- `components/` → Componentes propios del módulo  
- `services/` → Consumo de API  
- `store/` → Estado (Jotai)  

---

## 📁 Estructura del proyecto

```
mi-punto-frontend/
│
├── public/
│
├── src/
│ ├── app/ # Configuración global
│ ├── assets/ # Recursos estáticos
│ ├── components/
│ │ └── ui/ # Componentes reutilizables (shadcn)
│ ├── lib/ # Utilidades generales
│ ├── modules/ # Módulos del negocio
│ │ ├── auth/
│ │ ├── business/
│ │ └── reviews/
│ ├── shared/ # Código compartido
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
│
├── .gitignore
├── components.json # Configuración de shadcn
├── jsconfig.json # Alias de importación (@)
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md

```

---

## 🔄 Flujo de funcionamiento

1. El usuario interactúa con la interfaz (React)  
2. Se ejecutan eventos (formularios, botones)  
3. Se maneja el estado con Jotai  
4. Se realizan peticiones al backend  
5. Se actualiza la UI con la respuesta  

---

## 💾 Manejo de estado

Se utiliza **Jotai** para:

- Manejar estado global  
- Compartir datos entre componentes  
- Persistir información (ej: sesión de usuario) usando `localStorage`  

---

## 🎨 Interfaz de usuario

El frontend está construido con:

- **Tailwind CSS** → estilos rápidos y escalables  
- **shadcn/ui** → componentes modernos y reutilizables  

Esto permite una interfaz limpia, consistente y profesional.

---

## ⚙️ Instalación y ejecución

### 1. Clonar el repositorio

```
git clone <URL_DEL_REPOSITORIO>
cd mi-punto-frontend
```

---

### 2. Instalar dependencias

```
npm install
```

---

### 3. Ejecutar el proyecto

```
npm run dev
```

---

## 🌐 Acceso

- Aplicación local:  
  http://localhost:5173/

---

## 🔗 Conexión con backend

El frontend está diseñado para consumir una API REST desarrollada en FastAPI.

Las peticiones se organizan por módulos dentro de la carpeta modules/.

## 🧪 Estado del proyecto

En desarrollo bajo metodología ágil (Scrum), organizado por sprints y gestionado con Jira.

## 👥 Equipo de desarrollo
Natalia Andrea Bravo Castro
Juan Camilo Campo Tangarife

#actualizacion de repo por prueba de CI/CD