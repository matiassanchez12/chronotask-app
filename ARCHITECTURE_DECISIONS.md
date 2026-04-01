# Architecture Decisions

Este archivo registra las decisiones arquitectónicas importantes del proyecto.
El objetivo es entender por qué se tomaron ciertas decisiones y evitar cambiar cosas importantes sin contexto.

---

## [FECHA] - Estructura base del proyecto

### Contexto
Se necesita definir una estructura inicial para organizar el proyecto y permitir escalabilidad sin sobreingeniería.

### Decisión
Se utilizará una arquitectura basada en:
- Controllers
- Services
- Repositories
- Models
- DTOs
- Requests / Validators

### Consecuencias
Pros:
- Código organizado
- Fácil de testear
- Separación de responsabilidades
- Escalable

Contras:
- Más archivos
- Más estructura inicial