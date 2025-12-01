# Configuración del Proyecto

## Configuración del archivo .env

Crear un archivo `.env` con las variabes mostradas en el archivo `.env.example`. Luego, rellena las variables de entorno con tus propios valores. Desglose de cada variable:

- `PROD_DB_HOST`: La dirección IP de su base de datos.
- `PROD_DB_DATABASE`: El nombre de su base de datos.
- `PROD_DB_USER`: El nombre de usuario para acceder a su base de datos.
- `PROD_DB_PASSWORD`: La contraseña para acceder a su base de datos.
- `PROD_DB_PORT`: El puerto en el que se ejecuta su base de datos.
- `SERVER_PORT`: El puerto en el que se ejecutará el servidor de la aplicación.
- `NODE_ENV`: El entorno en el que se ejecutará la aplicación. Puede ser `development`, `production` o `test`.
- `JWT_SECRET`: La clave secreta utilizada para firmar los tokens JWT. Puede generar una utilizando un generador de claves aleatorias o simplemente una cadena de caracteres aleatoria.

## Generación del JWT Secret

Una opcion para generar una clave secreta puede utilizar el script `JWTgenerator.js` que se encuentra en la carpeta `scripts/`. Para ejecutar el script, simplemente ejecute el siguiente comando:

```sh
node scripts/JWTgenerator.js
```

## Base de datos
El sistema utiliza una base de datos MySQL para almacenar y gestionar los datos. Antes de ejecutar las migraciones y los seeders, es necesario crear la base de datos.

### MySQL
Puede utilizar el script `bd.sql` que se encuentra en la carpeta `scripts/` para crear la base de datos. Para ejecutar el script, siga estos pasos:

1. Abra una terminal y navegue hasta la carpeta del proyecto.
2. Ejecute el siguiente comando para iniciar sesión en MySQL:
```sh
mysql -u <nombre_de_usuario> -p
```
1. Ingrese su contraseña cuando se le solicite.
2. Una vez que haya iniciado sesión en MySQL, ejecute el siguiente comando para crear la base de datos:
```sh
source scripts/bd.sql
```
Esto ejecutará el script `bd.sql` y creará la base de datos necesaria para el funcionamiento del sistema.

Recuerde reemplazar `<nombre_de_usuario>` con el nombre de usuario de su instalación de MySQL Server que posea permisos para la creacion de nuevas bases de datos.

Una vez que haya creado la base de datos, puede continuar con la configuración del proyecto ejecutando las migraciones y los seeders.

## Migraciones de Sequelize

Para ejecutar las migraciones, primero asegúrese de que Sequelize CLI esté instalado. Luego, puede ejecutar las migraciones con el siguiente comando:

```sh
npx sequelize-cli db:migrate
```
Es importante que este especificado en el archivo `.env` el usuario con permisos de creación de tablas.

## Seeders de Sequelize

Para ejecutar los seeders, primero asegúrese de que Sequelize CLI esté instalado. Luego, puede ejecutar los seeders con el siguiente comando:

```sh
npx sequelize-cli db:seed:all
```

## Dependencias

Para instalar las dependencias del proyecto, ejecute el siguiente comando:
```sh
npm install
```
Puede que el gestor de paquetes marque algunas advertencias de seguridad, para solucionarlas ejecute el siguiente comando:
```sh
npm audit fix
```