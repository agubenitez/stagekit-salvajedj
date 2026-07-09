# Posibles mejoras futuras

> Para el catálogo completo de mejoras planificadas, ver [`docs/IMPROVEMENTS.md`](./docs/IMPROVEMENTS.md)

## Nueva sección: BioFondoOverlay

Sección de presentación con imagen de fondo a full-width y texto superpuesto
en un panel semitransparente con backdrop-blur.

**Diseño:**
- Imagen como fondo del section con overlay oscuro (`var(--overlay)`)
- Panel de texto centrado con estilo `card` y backdrop-blur
- Ideal para fotos poderosas donde la imagen es la protagonista

**Estructura conceptual:**

```
<section>
  <img background full-width object-cover />
  <div overlay absolute inset-0 />
  <div card backdrop-blur centered>
    <span sectionTag />
    <h2 heading />
    <div divider />
    <p description />
  </div>
</section>
```

**Config:**
- Mismo esquema que `BioConFoto` (imagen + textos)
- Renderizado condicional vía layout/preset
- Podría compartir esquema de datos con `BioConFoto` usando un campo `layout: 'split' | 'overlay'`
