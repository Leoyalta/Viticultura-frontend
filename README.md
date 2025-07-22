# 🍇 Viticultura Frontend

## Descripción

Este proyecto es una aplicación web desarrollada con Angular 19 diseñada específicamente para la gestión integral de clientes, parcelas vitivinícolas, y el control de productos y pedidos. Su objetivo principal es optimizar las operaciones en el sector vitivinícola, proporcionando herramientas intuitivas para la administración de datos geográficos, de clientes, de productos en almacén y de los procesos de pedido.

La aplicación permite:

- Gestionar el almacén de productos, permitiendo el registro, consulta y actualización de los artículos disponibles en almacén, lo que facilita un control preciso de los recursos necesarios.
- Consultar y registrar clientes de forma eficiente, manteniendo un registro detallado de sus interacciones y necesidades.
- Dibujar y guardar parcelas geográficas en un mapa interactivo.
- Visualizar múltiples ubicaciones (parcelas o puntos de interés) con detalles enriquecidos. Cada ubicación puede asociarse con información relevante, como el tipo de uva, el historial de cultivo, datos de rendimiento o el cliente responsable, facilitando una visión holística de las operaciones.
- Registrar y administrar pedidos de clientes, desde la creación inicial hasta el seguimiento de su estado, optimizando el flujo de trabajo de ventas y distribución.
- Conectarse con una API backend propia desplegada en Render para asegurar la persistencia y la recuperación segura de todos los datos de clientes, georreferenciados, de productos y de pedidos, garantizando la integridad y disponibilidad de la información.

La interfaz de usuario se caracteriza por un diseño moderno y responsive, adaptándose perfectamente a cualquier dispositivo (escritorio, tablet, móvil). Integra Mapbox GL JS para ofrecer una experiencia de mapa vectorial altamente interactiva y performante, permitiendo la manipulación y visualización de polígonos personalizados que representan las parcelas.

## Tecnologías Utilizadas

- **Angular 19**: Framework moderno para construir aplicaciones SPA.
- **Angular Material**: Una biblioteca de componentes UI/UX de alta calidad que implementa los principios de Material Design de Google.
- **Firebase Authentication**: Para registro, login y logout de usuarios.
- **Mapbox GL JS**: Visualización de mapas vectoriales e interacción con polígonos.
- **@mapbox/mapbox-gl-draw**: Una extensión de Mapbox GL JS que habilita la funcionalidad de dibujar, editar y eliminar formas geométricas (polígonos, líneas, puntos) directamente sobre el mapa, esencial para la digitalización de parcelas vitivinícolas.
- **FullCalendar**: Vista de calendario para eventos relacionados.
- **SCSS**: Preprocesador de CSS que permite el uso de variables, anidamiento y otras características avanzadas.
- **Reactive Forms**: Módulo de Angular para construir formularios reactivos con validaciones y control total del estado.
- **Angular Router**: Navegación dinámica con rutas protegidas.

## Instrucciones de Instalación y Ejecución

1. Clona el repositorio:

   - git clone https://github.com/Leoyalta/Viticultura-frontend

2. Entra en el directorio del proyecto:

   - cd Viticultura-frontend

3. Instala las dependencias:

   - npm install

4. Configura las variables de entorno:

- Crea un archivo .env en el directorio src/ de tu proyecto.
- Añade tus claves API y tokens de servicio (Firebase, Mapbox) en este archivo, siguiendo el formato VARIABLE_NOMBRE=VALOR.

5. Inicia el servidor de desarrollo:
   - npm run start

## Características Principales

- ✅ Gestión Completa de Datos: Permite el registro, consulta y actualización de productos, clientes y pedidos a través de formularios reactivos y validados, asegurando la consistencia y precisión de la información.
- ✅ Integración con Mapbox y capas personalizadas.
- ✅ Consumo del backend para persistir y leer datos georreferenciados.
- ✅ Visualización Detallada de Ubicaciones: Proporciona una vista de detalles y mapa interactivo que muestra múltiples ubicaciones de forma clara, permitiendo a los usuarios explorar la información asociada a cada parcela o punto de interés.
- ✅ Selector de estilos del mapa (satélite, calles, exteriores, etc.).
- ✅ Registro y autenticación con Firebase (email/contraseña).
- ✅ Diseño moderno y responsive (Material + SCSS).
- ✅ Arquitectura modular con componentes standalone.
- ✅ Navegación dinámica y estructura standalone.
- ✅ Diseño responsive y moderno con SCSS.
- ✅ Protección de rutas para contenidos privados.

## Demo

Puedes ver el proyecto en acción aquí:

- https://viticultura-frontend.vercel.app/
