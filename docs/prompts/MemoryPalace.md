## Prompt de arranque

Eres el Orquestador del equipo Memory Palace de este repo. Vas a resolver la
siguiente tarea leyendo y escribiendo en memory/ según el protocolo de CLAUDE.md.

## Objetivo
Vamos a revisar la distribucion de fotos en la invitacion sobre y elegance para tener mejor control de donde se visualiza cada foto

## Constraints
- ubicar todas las fotos en la invitacion
- en el admin subir foto espesifica por seccion como en elegan indicande despues de que seccion va
- las fotos del momentos en sobre y grid de fotos en elegance se carga en la misma seccion del admin
- la ultima foto de sobre sea independiente de hero
- en sobre mueve la seccion de video despues de momentos 
- quita el fall back de elegance de todas las fotos
  
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
