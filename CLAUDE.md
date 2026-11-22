# XT LABS · Reels con Doc XT (Remotion)

Dueño: Alex (TDAH). Habla en español, claro, corto, con listas y pasos simples. No resumir lo hecho, solo ejecutar. Preguntar si falta información.

## Qué es el proyecto
- Marca: **XT LABS** (suplementos deportivos). Cuentas nuevas en Instagram, TikTok y Facebook.
- Contenido **educativo** de nutrición, entrenamiento y farmacología deportiva.
- Mascota: **Doc XT** (científico de bloques, bata blanca, camiseta roja con insignia XT, gafas redondas).
- Estilo visual: fondo #0B0B0D con cuadrícula, rojo #E52521, blanco, tipografía Anton.

## Reglas de contenido (no negociables)
- Farmacología: solo educación y riesgos. **Nunca dosis, ciclos, protocolos ni dónde comprar.**
- Cerrar con "consulta a tu médico" cuando haya tema de salud.
- Sin promesas de resultados.

## Cómo está armado
- `src/ReelMito.tsx` + `src/mitos.ts`: plantilla "Mito o Ciencia". Un reel nuevo = un objeto en `mitos.ts` (textos + tiempos en segundos).
- `src/ReelEstancamiento.tsx`, `src/ReelCreatina.tsx`, `src/BienvenidaComunidad.tsx`: videos ya hechos.
- `public/`: `voz-*.mp3` (voces), `doc-saludo*.mp4` (clips de Doc XT), `cientifico.png` y `personaje/` (imágenes).
- `videos/`: MP4 finales listos para publicar.
- `guiones/serie-mito-o-ciencia.md`: guiones de la serie.
- La voz y el clip son opcionales: si el archivo no existe, el video igual renderiza.

## Comandos
- Vista previa: `npm run dev`
- Renderizar un reel: `npx remotion render <IdComposicion> videos/<nombre>.mp4`
- Composiciones: `BienvenidaComunidad`, `ReelEstancamiento`, `ReelCreatina`, `ReelProteina`, `ReelSueno`, `ReelSuplementos`
- Formato: 1080x1920, 30 fps. Zonas seguras de Instagram ya aplicadas.

## Herramientas externas (por conectores de Claude)
- **ElevenLabs**: usar la voz guardada llamada **"Doc XT"** (buscarla por nombre con `creative_list_voices`). Modelo `eleven_v3`, con etiquetas de emoción ([excited], [playful], [confident]…). Para obtener tiempos por palabra, transcribir con `eleven_scribe_v1`.
- **Higgsfield**: personaje guardado como Element **DocXT** (buscarlo por nombre con `manage_reference_elements`). Clips de saludo: modelo `seedance_2_5`, modo `omni_reference`, 5 s, 720p, 1:1, sin audio (35 créditos c/u), partiendo de la imagen base aprobada de Doc XT.
- Los archivos generados se bajan por su URL pública. En un computador normal se descargan directo con `curl -L -o archivo URL`.
- **No escribir IDs, URLs de cuenta ni claves en este repositorio: es público.**

## Pendiente ahora mismo
Faltan los clips de saludo de Doc XT (ya generados en Higgsfield, 3 clips de 5 s: proteína, sueño, suplementos). Pedirle a Alex los links de descarga, bajarlos a `public/` con estos nombres y renderizar:

| Reel | Archivo en `public/` | Salida |
|---|---|---|
| ReelProteina | `doc-saludo-proteina.mp4` | `videos/04-reel-proteina.mp4` |
| ReelSueno | `doc-saludo-sueno.mp4` | `videos/05-reel-sueno.mp4` |
| ReelSuplementos | `doc-saludo-suplementos.mp4` | `videos/06-reel-suplementos.mp4` |

Comando: `npx remotion render <IdComposicion> <salida>`. Las voces `voz-proteina.mp3`, `voz-sueno.mp3` y `voz-suplementos.mp3` ya están en `public/`.

## Siguientes ideas
- Reel de cardio y más reels de la serie (ver `guiones/`).
- Calendario: bienvenida (fijada) → estancamiento → creatina → proteína → sueño → suplementos.
