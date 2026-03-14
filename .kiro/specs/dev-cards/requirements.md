# Documento de Requisitos — DevCards

## Introducción

DevCards es una aplicación web frontend que permite a desarrolladores generar cartas coleccionables digitales al estilo de videojuegos (FIFA, Pokémon, RPG) basadas en sus habilidades técnicas. El usuario rellena un formulario con su nombre, clase, nivel y tecnologías dominadas, y obtiene una carta visual que puede descargar como imagen PNG. De forma ocasional, la carta puede activar un efecto especial (holográfico o borde dorado) según las estadísticas introducidas. El diseño contempla escalabilidad futura hacia efectos premium de pago y envío físico.

---

## Glosario

- **App**: La aplicación web DevCards en su conjunto.
- **Carta**: La representación visual generada a partir de los datos del usuario, inspirada en cartas coleccionables de videojuegos.
- **Formulario**: El panel de entrada de datos donde el usuario introduce su información.
- **Previsualizador**: El componente que renderiza la Carta en tiempo real mientras el usuario escribe.
- **Clase**: La especialización técnica del desarrollador (Frontend, Backend, Fullstack, DevOps).
- **Nivel**: Los años de experiencia del desarrollador, expresados como número entero entre 0 y 50.
- **Tecnología**: Una habilidad técnica concreta (ej. React, Python, Docker) con una puntuación asociada.
- **Puntuación**: Valor numérico entero entre 1 y 99 que representa el dominio de una Tecnología.
- **Efecto Especial**: Tratamiento visual destacado (borde dorado o efecto holográfico) que se aplica a la Carta bajo ciertas condiciones.
- **Exportador**: El módulo responsable de convertir la Carta renderizada en un archivo PNG descargable.
- **Motor de Efectos**: El módulo que evalúa las condiciones de activación del Efecto Especial.

---

## Requisitos

### Requisito 1: Formulario de entrada de datos

**User Story:** Como desarrollador, quiero rellenar un formulario con mis datos profesionales, para que la App pueda generar mi Carta personalizada.

#### Criterios de Aceptación

1. THE Formulario SHALL presentar campos de entrada para: nombre (texto libre), Clase (selector con opciones Frontend, Backend, Fullstack, DevOps), Nivel (número entero) y exactamente 3 Tecnologías con su Puntuación asociada.
2. WHEN el usuario introduce un Nivel fuera del rango 0–50, THE Formulario SHALL mostrar un mensaje de error indicando que el valor debe estar entre 0 y 50.
3. WHEN el usuario introduce una Puntuación fuera del rango 1–99, THE Formulario SHALL mostrar un mensaje de error indicando que el valor debe estar entre 1 y 99.
4. WHEN el usuario deja el campo de nombre vacío e intenta descargar la Carta, THE Formulario SHALL mostrar un mensaje de error indicando que el nombre es obligatorio.
5. THE Formulario SHALL requerir que las 3 Tecnologías tengan nombre y Puntuación antes de permitir la descarga.

---

### Requisito 2: Previsualización en tiempo real

**User Story:** Como desarrollador, quiero ver cómo queda mi Carta mientras relleno el formulario, para poder ajustar los datos antes de descargarla.

#### Criterios de Aceptación

1. WHEN el usuario modifica cualquier campo del Formulario, THE Previsualizador SHALL actualizar la Carta renderizada en menos de 100ms.
2. THE Previsualizador SHALL mostrar en la Carta: el nombre del desarrollador, la Clase, el Nivel, las 3 Tecnologías y sus Puntuaciones.
3. WHILE el Formulario contiene datos incompletos, THE Previsualizador SHALL mostrar la Carta con los datos disponibles y valores por defecto visualmente distinguibles para los campos vacíos.
4. THE Previsualizador SHALL renderizar la Carta con un diseño visual inspirado en cartas coleccionables de videojuegos, incluyendo tipografía estilizada, fondo temático y disposición estructurada de estadísticas.

---

### Requisito 3: Diseño visual de la Carta

**User Story:** Como desarrollador, quiero que mi Carta tenga un diseño atractivo y reconocible, para que sea visualmente impactante al compartirla.

#### Criterios de Aceptación

1. THE App SHALL asignar a cada Clase un esquema de color y un icono o símbolo visual diferenciado.
2. THE Carta SHALL mostrar la Puntuación de cada Tecnología con una representación gráfica (barra, número destacado u otro elemento visual) además del valor numérico.
3. THE Carta SHALL adaptar su apariencia visual (paleta de colores, efectos de fondo) en función de la Clase seleccionada.
4. THE App SHALL renderizar la Carta con dimensiones fijas de 400×560 píxeles para garantizar consistencia en la exportación.

---

### Requisito 4: Exportación como imagen PNG

**User Story:** Como desarrollador, quiero descargar mi Carta como imagen PNG, para poder compartirla en redes sociales o guardarla.

#### Criterios de Aceptación

1. WHEN el usuario pulsa el botón de descarga, THE Exportador SHALL generar un archivo PNG de la Carta con resolución mínima de 2× (800×1120 píxeles) para garantizar calidad en pantallas de alta densidad.
2. WHEN el usuario pulsa el botón de descarga, THE Exportador SHALL iniciar la descarga del archivo en el navegador con el nombre `devcard-[nombre].png`.
3. IF el proceso de exportación falla, THEN THE Exportador SHALL mostrar un mensaje de error indicando que la descarga no pudo completarse.
4. WHEN el Formulario contiene datos incompletos obligatorios, THE Exportador SHALL deshabilitar el botón de descarga.

---

### Requisito 5: Motor de Efectos Especiales

**User Story:** Como desarrollador, quiero que mi Carta pueda mostrar un efecto especial si mis estadísticas son destacadas, para que la experiencia sea sorprendente y gratificante.

#### Criterios de Aceptación

1. WHEN la suma de las 3 Puntuaciones supera 270, THE Motor de Efectos SHALL activar el Efecto Especial en la Carta con una probabilidad del 100%.
2. WHEN la suma de las 3 Puntuaciones está entre 240 y 270 (inclusive), THE Motor de Efectos SHALL activar el Efecto Especial con una probabilidad del 40%.
3. WHEN el usuario introduce una combinación de Tecnologías definida como "legendaria" (lista configurable en el código), THE Motor de Efectos SHALL activar el Efecto Especial independientemente de las Puntuaciones.
4. WHEN el Motor de Efectos activa el Efecto Especial, THE Previsualizador SHALL aplicar a la Carta un borde dorado animado o un efecto de gradiente holográfico iridiscente.
5. WHEN el Motor de Efectos no activa el Efecto Especial, THE Previsualizador SHALL mostrar la Carta sin ningún tratamiento visual adicional.
6. THE Motor de Efectos SHALL evaluar las condiciones de activación cada vez que el usuario modifica cualquier campo del Formulario.

---

### Requisito 6: Compatibilidad y rendimiento

**User Story:** Como desarrollador, quiero que la App funcione correctamente en los navegadores modernos más usados, para poder acceder desde cualquier dispositivo.

#### Criterios de Aceptación

1. THE App SHALL funcionar correctamente en las versiones actuales de Chrome, Firefox, Safari y Edge.
2. THE App SHALL cargar y mostrar el Formulario y el Previsualizador en menos de 3 segundos en una conexión de 10 Mbps.
3. THE App SHALL ser completamente funcional sin requerir ningún servidor backend ni llamadas a APIs externas.
4. WHERE el dispositivo tiene una pantalla de ancho inferior a 768px, THE App SHALL presentar el Formulario y el Previsualizador en disposición vertical apilada.

---

### Requisito 7: Extensibilidad para efectos premium (fuera de scope inicial)

**User Story:** Como producto, quiero que la arquitectura contemple la adición futura de efectos premium de pago, para no tener que reescribir el sistema de efectos cuando se implemente Stripe.

#### Criterios de Aceptación

1. THE Motor de Efectos SHALL estar implementado como módulo independiente con una interfaz que permita registrar nuevos tipos de Efecto Especial sin modificar la lógica existente.
2. THE Carta SHALL renderizar los efectos visuales a partir de una configuración de efecto inyectable, de forma que un efecto premium futuro pueda aplicarse con el mismo mecanismo que el efecto gratuito.
