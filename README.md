# Prueba Técnica Angular Developer - NEORIS

## Sobre el Proyecto

Este proyecto ha sido desarrollado por Jaime Benalcazar como una solución moderna para la gestión de productos financieros utilizando Angular. Destaca por su interfaz intuitiva y funcionalidades avanzadas, diseñadas para ofrecer una experiencia de usuario óptima.

## Características

- **Listado y gestión de productos financieros:** Permite a los usuarios visualizar, agregar, editar y eliminar productos.
- **Interfaz de Usuario Amigable:** Diseño responsive y fácil de navegar.
- **Notificaciones y Validaciones:** Implementa notificaciones para acciones de usuario y validaciones para el ingreso de datos.

## Tecnologías Utilizadas

- Angular 16.2.0
- TypeScript 4.9.4
- Jest para pruebas unitarias

## Demostración en Vivo

Este proyecto está desplegado y disponible para su acceso público en Firebase. Puedes ver la aplicación en funcionamiento a través del siguiente enlace:

[Prueba Técnica Angular Developer - NEORIS en Firebase](https://angular-neoris-tech-test.web.app/product-list)

## Instalación y Ejecución

Para ejecutar este proyecto localmente:

```bash
npm install
npm start
```

Para construir el proyecto para producción:

```bash
npm run build
```

Para ejecutar las pruebas unitarias:

```bash
npm run test
```

### Resultados de los Test

| File                                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                 |
| ---------------------------------------- | ------- | -------- | ------- | ------- | --------------------------------- |
| All files                                | 79.32   | 55.88    | 70.58   | 79.48   |                                   |
| core/models                              | 81.81   | 100      | 60      | 81.81   |                                   |
| financial-product.model.ts               | 81.81   | 100      | 60      | 81.81   | 38-43                             |
| core/services                            | 52.72   | 40       | 38.88   | 52.72   |                                   |
| financial-products.service.ts            | 62.5    | 66.66    | 53.84   | 62.5    | 44-54,72-73,117-128               |
| notification.service.ts                  | 26.66   | 0        | 0       | 26.66   | 20-62                             |
| features/product-list                    | 93.65   | 60       | 88.88   | 95.08   |                                   |
| product-list.component.html              | 100     | 100      | 100     | 100     |                                   |
| product-list.component.ts                | 93.54   | 60       | 88.88   | 95      | 52-55                             |
| features/product-registration            | 82.08   | 64.28    | 82.35   | 82.08   |                                   |
| product-registration.component.html      | 100     | 100      | 100     | 100     |                                   |
| product-registration.component.ts        | 81.81   | 64.28    | 82.35   | 81.81   | 91-93,103-104,128,131,166,182-190 |
| shared/components/banco-logo             | 100     | 100      | 100     | 100     |                                   |
| banco-logo.component.html                | 100     | 100      | 100     | 100     |                                   |
| banco-logo.component.ts                  | 100     | 100      | 100     | 100     |                                   |
| shared/components/notification-confirmar | 100     | 100      | 100     | 100     |                                   |
| notification-pop-up.component.html       | 100     | 100      | 100     | 100     |                                   |
| notification-pop-up.component.ts         | 54.54   | 100      | 33.33   | 54.54   | 21-28                             |

## Contribuciones

Las contribuciones son bienvenidas. Por favor, realiza un fork del proyecto y envía un pull request con tus cambios.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulte el archivo `LICENSE` para obtener más detalles.

## Acerca del Desarrollador

**Jaime Benalcazar** - Apasionado por el desarrollo de soluciones tecnológicas eficientes y efectivas.
