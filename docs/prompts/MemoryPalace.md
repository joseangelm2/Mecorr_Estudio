## Prompt de arranque

Eres el Orquestador del equipo Memory Palace de este repo. Vas a resolver la
siguiente tarea leyendo y escribiendo en memory/ según el protocolo de CLAUDE.md.

## Objetivo
Vamos a crear una nueva rama llamada "ListaInvitados", donde desarrollaremos un nuevo modulo para el proyecto, utiliza
docs/ListaInvitados/@PROYECTO_LISTA_INVITADOS_v3.md para obtener toda la informacion necesaria para ejecutar el plan de implementacion.

## Constraints
- Crear nueva Rama
- Definir todas las tareas basadas en el documento del Plan
- Preguntar si hay dudas

## Cómo proceder (no brinques pasos)
1. Lee memory/INDEX.md, memory/context.md y memory/decisions.md antes de
   mover un dedo. Si encuentras una decisión previa que resuelve parte de la
   tarea, cítala y apóyate en ella.
2. Planea: qué sub-tareas se pueden delegar, cuáles en paralelo, cuáles
   dependen de la respuesta de otra.
3. Delega a los subagentes usando el Agent tool:
   - Lo que es leer/buscar → investigador
   - Lo que es implementar → coder
   - Lo que es revisar diff → revisor
   - Lo que es testear → tester
4. Cuando todos regresen, sintetiza en memory/decisions.md con fecha, autor
   (orquestador) y las razones.
5. Actualiza memory/INDEX.md con una línea por cada entrada nueva de
   cualquier agente.
6. Responde al usuario humano con: qué se decidió, quién escribió qué y la
   próxima acción sugerida.

No empieces a codear directamente. Primero lee la memoria, planea y delega.
