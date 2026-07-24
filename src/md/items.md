---
title: "Mantenedor de Artículos"
author: "Carlos"
date: "2026-07-23"
toc-title : "Contenido"
css:
  - styles.css
---

## OBJETO ##

Definir las estructuras y el flujo del registro , edición y eliminación de un artículo. Además del flujo de ingreso y egreso de existencias, control de inventario y ajustes de inventarios.

## PRIMERO: El Modelo ##

## Tabla Productos (`products`)

### Propósito

La tabla **`products`** representa el **catálogo maestro de productos** del sistema. Su objetivo es almacenar el **concepto principal** de un producto, independiente de su marca, fabricante, presentación, formato comercial o cualquier otra característica específica.

Cada registro de esta tabla representa un concepto único dentro del negocio, por lo que el campo **"name"** es único y define la identidad del producto.

Los detalles comerciales y las variantes del producto son administrados por la tabla **`items`**, la cual mantiene una relación con `products`.


### Filosofía de diseño

La tabla `products` no representa un artículo comercial, sino el **concepto base** sobre el cual se construye el catálogo del negocio.

Esta separación permite reutilizar un mismo producto para múltiples artículos comerciales, evitando duplicidad de información y facilitando la generación de reportes, estadísticas y procesos de inventario.


#### Ejemplos

#### Farmacia

En una farmacia, el producto representa el **principio activo**.

**Producto**

  1. Ibuprofeno

**Items**

  1. Ibuprofin 400 mg
  1. Ibuprofin 600 mg
  1. Kitadol 400 mg


Todos los artículos anteriores pertenecen al mismo producto: **Ibuprofeno**.

#### Almacén de barrio

En un almacén, el producto representa el alimento o artículo genérico.

**Producto**

 1. Papas Fritas

**Items**

  1. Papas Fritas Tim 150 g
  1. Papas Fritas Marco Polo 150 g
  1. Papas Fritas Evercrisp 250 g


El concepto del producto no cambia; solamente cambian la marca y la presentación comercial.

#### Ferretería

En una ferretería, el producto representa el tipo de herramienta.

**Producto**

 1. Martillo

**Items**


 1. Martillo Stanley 16 oz
 1. Martillo Truper 20 oz
 1. Martillo Bauker 18 oz


El cliente compra distintos artículos comerciales, pero todos pertenecen al mismo producto.

#### Verdulería

En una verdulería normalmente existen menos variantes comerciales, pero el modelo continúa siendo válido.

**Producto**

 1. Limón

**Items**

 1. Limón Eureka
 2. Limón Sutil
 3. Limón Meyer
 4. Limón de Pica


En este rubro es posible que exista un único artículo para un producto determinado. Aunque la separación entre `products` e `items` pueda parecer menos evidente, mantener este modelo permite conservar una estructura uniforme para todos los rubros soportados por el sistema.

### Identidad del producto

El nombre almacenado en la tabla `products` representa la identidad del producto.
Por esta razón, un producto **no debe cambiar de identidad**.

Por ejemplo: **Ibuprofeno** por **Paracetamol** o **Manzana** por **Naranja**.

En el ejemplo anterio no corresponde a una modificación de nombre del producto, sino a la creación de un producto nuevo.

En este caso debe crear un nuevo registro y mantener el anterior para conservar la integridad del catálogo y del historial del negocio.

### Corrección de nombres

Como excepción, un administrador del negocio podrá realizar correcciones de escritura cuando exista un error ortográfico o tipográfico.

Ejemplos válidos:

  - Ibufrofeno -> Ibuprofeno
  - Limon -> Limón
  - Acido Acetilsalicilico -> Ácido Acetilsalicílico

Estas correcciones no modifican la identidad del producto y deberán quedar registradas en el historial del sistema para mantener la trazabilidad del catálogo maestro.

### Eliminación de productos

Los productos no deben eliminar el registro de la base de datos.

Cuando un producto deja de utilizarse, su estado deberá cambiar a **`disabled`** o **`suspended`**, según las reglas del negocio.

Este enfoque permite:

* Conservar la integridad referencial.
* Mantener el historial de ventas, compras y movimientos de inventario.
* Reactivar un producto cuando sea necesario.
* Evitar la creación de productos duplicados.

Si un usuario intenta crear un producto cuyo nombre ya existe pero se encuentra deshabilitado, el sistema podrá ofrecer la posibilidad de **reactivar** el producto, en lugar de crear un nuevo registro.


### Principio fundamental

La tabla `products` constituye el **catálogo maestro del negocio**.

Su información debe ser estable, consistente y compartida por todos los módulos del sistema.

Mientras la tabla `items` representa los artículos comercializados, `products` representa el conocimiento permanente del negocio: los conceptos sobre los cuales se construye el catálogo y que sirven de base para inventario, compras, ventas, reportes y análisis históricos.

**Descripción de la tabla**

| Campo | Descripción |
|-------|-------------|
| id | Identificador único |
| name | Nombre del artículo |
| created_at | Fecha de creación |
| updated_at | Fecha de la última modificación |
| active | Estado del artículo |

**Mariadb / Mysql**

```sql
CREATE TABLE `products` (
  `id` CHAR(36) NOT NULL DEFAULT (UUID()),
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `status` ENUM('enabled','disabled','suspended') NOT NULL DEFAULT 'enabled',
  PRIMARY KEY (`id`),
  UNIQUE (`name`)
);

INSERT INTO `products`(name) VALUES( 'chocolate'),( 'prestobarba');


```

**Drizzle ORM**

```ts
import { mysqlTable, char, varchar, timestamp, mysqlEnum, unique } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const products = mysqlTable('products', {
  id: char('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar('name', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').default(null).onUpdateNow(),
  status: mysqlEnum('status', ['enabled', 'disabled', 'suspended']).notNull().default('enabled'),
});

```
## Tabla “brands”: 

Esta tabla contendrá un listado de marcas y/o fabricantes de productos, esta tabla servirá de referencia para establecer los artículos en la tabla “items”.

Campos ( Fields )
Descripción ( Description )
id
Identificador único
name
Nombre de la marca y/o fabricante
user_id
Identificador del usuario
created_at
Fecha de creación
updated_at
Fecha de la última modificación
active
Estado de la marca

**Mariadb / Mysql**

```sql
CREATE TABLE `brands` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(255) NOT NULL ,
  `user_id` INT(11) NOT NULL ,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ,
  `active` ENUM('enabled','disabled','suspended') NOT NULL DEFAULT 'enabled' ,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE (`name`));
```

```sql
INSERT INTO `brands`(name,user_id) VALUES( 'Merck Serona' , 1  )  , ( 'Laboratorios Chile' , 1 );
```

## Tabla “categories”: 

Esta tabla contendrá un listado de categorías creadas por el administrador del sistema para organizar los artículos.

Campos ( Fields )
Descripción ( Description )
id
Identificador único
name
Nombre de la categoría
user_id
Identificador del usuario
created_at
Fecha de creación
updated_at
Fecha de la última modificación
active
Estado del artículo

**Mariadb / Mysql**

```sql
CREATE TABLE `categories` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(255) NOT NULL ,
  `user_id` INT(11) NOT NULL ,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ,
  `active` ENUM('enabled','disabled','suspended') NOT NULL DEFAULT 'enabled' ,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE (`name`));
```

```sql
INSERT INTO `categories`(`name`,`user_id`) VALUES( 'diabetes' , 1 );
```

## Tabla “items”: 

Esta tabla contendrá el listado de artículos disponibles para la venta , esta tabla tiene por objeto individualizar un producto genérico a uno específico , como por ejemplo el artículo puede contener un producto como “Papas Fritas corte Americano” , además el peso y precio del producto, también características de su envase que lo individualizan.

Nota : Se podría agregar un campo en el items que sirva para contener fechas de vencimiento.

Campos ( Fields )
Descripción ( Description )
id
Identificador único
user_id
Identificador del usuario
product_id
Identificador del producto
brand_id
Identificador de la marca y/o fabricante
category_id
Identificador de la categoría
price
Precio de venta del artículo
created_at
Fecha de creación
updated_at
Fecha de la última modificación
active
Estado del artículo

**Mariadb / Mysql**

```sql
CREATE TABLE `items` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `user_id` INT(11) NOT NULL,
  `product_id` INT(11) NOT NULL,
  `brand_id` INT(11) NOT NULL,
  `category_id` INT(11) NOT NULL,
  `price` INT(11) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ,
  `active` ENUM('enabled','disabled','suspended') NOT NULL DEFAULT 'enabled' ,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE,
  UNIQUE (`product_id`,`brand_id`)
);
```

```sql
INSERT INTO items( `user_id` , `product_id` , `brand_id` , `category_id` , `price` ) VALUES
( 1 , 1 , 1 , 1 , 19990 ),
( 1 , 2 , 2 , 1 , 22990 );
```

```sql
SELECT
i.id AS id ,
p.name AS name ,
b.name AS brand ,
c.name AS category ,
FORMAT( i.price , 0 ) AS price
FROM items i
JOIN products p ON p.id = i.product_id
JOIN brands b ON b.id = i.brand_id
JOIN categories c ON c.id = i.category_id
WHERE i.active = 'enabled'
AND p.active = 'enabled'
AND b.active = 'enabled'
AND c.active = 'enabled' ;
```

+----+-------------------+--------------------+----------+--------+
| id | name              | brand              | category | price  |
+----+-------------------+--------------------+----------+--------+
|  1 | Glafornil Xr 1000 | Merck Serona       | diabetes | 19,990 |
|  2 | Hipoglucin 1000   | Laboratorios Chile | diabetes | 22,990 |
+----+-------------------+--------------------+----------+--------+

## Tabla “stores”: 

Esta tabla contendrá el listado de bodegas y/o locales disponibles para asignar artículos para la venta.

Campos ( Fields )
Descripción ( Description )
id
Identificador único
name
Nombre de la bodega y/o local
user_id
Identificador del usuario
created_at
Fecha de creación
updated_at
Fecha de la última modificación
active
Estado del artículo

**Mariadb / Mysql**

```sql
CREATE TABLE `stores` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(255) NOT NULL ,
  `user_id` INT(11) NOT NULL ,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ,
  `active` ENUM('enabled','disabled','suspended') NOT NULL DEFAULT 'enabled' ,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE (`name`));
```

## Tabla “suppliers”:

**Mariadb / Mysql**

```sql
CREATE TABLE `suppliers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(255) NOT NULL ,
  `user_id` INT(11) NOT NULL ,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ,
  `active` ENUM('enabled','disabled','suspended') NOT NULL DEFAULT 'enabled' ,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE (`name`));
```

```sql
INSERT INTO `suppliers`(`name`,`user_id`) VALUES( 'Todo a Mil' , 1 );
```

```sql
CREATE TABLE `invoice_reference` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `invoice_customer_id` INT(11) NULL,
  `invoice_supplier_id` INT(11) NULL,
  `user_id` INT(11) NOT NULL ,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ,
  `active` ENUM('enabled','disabled','suspended') NOT NULL DEFAULT 'enabled' ,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_invoice_supplier` FOREIGN KEY (`invoice_supplier_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_invoice_customer` FOREIGN KEY (`invoice_customer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
 CHECK( ( invoice_customer_id IS NULL AND invoice_supplier_id IS NOT NULL ) OR ( invoice_supplier_id IS NULL AND invoice_customer_id IS NOT NULL )
)
);
```

## Tabla “stock”: 

registra las entradas y salidas de existencias en las diferentes bodegas creadas en la tabla “store”, teniendo dos tipos de movimientos entradas y salidas de existencias.

Campos ( Fields )
Descripción ( Description )
id
Identificador único
user_id
Identificador del usuario
item_id
Identificador del artículo
store_id
Identificador de la bodega y/o Sucursal
invoice_id
Identificador de la factura
quantity
Cantidad de artículos
created_at
Fecha de creación
updated_at
Fecha de la última modificación
active
Estado del artículo

**Mariadb / Mysql**

```sql
CREATE TABLE `stock` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `user_id` INT(11) NOT NULL ,
  `item_id` INT(11) NOT NULL ,
  `store_id` INT(11) NOT NULL ,
  `invoice_id` INT(11) NOT NULL ,
  `quantity` INT(11) NOT NULL ,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ,
  `active` ENUM('enabled','disabled','suspended') NOT NULL DEFAULT 'enabled' ,
  PRIMARY KEY (`id`),
  INDEX `idx_invoice_id` (`invoice_id`) ,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON DELETE CASCADE ,
  FOREIGN KEY (`invoice_id`) REFERENCES `invoice_reference`(`id`) ON DELETE CASCADE
);
```

```sql
SELECT
i.id AS id ,
p.name AS name ,
b.name AS brand ,
c.name AS category,
SUM( CASE
WHEN  s.type = 'inbound' THEN s.quantity
WHEN  s.type = 'outbound' THEN -s.quantity
ELSE 0
            END
) AS total
FROM items i
JOIN products p ON p.id = i.product_id
JOIN brands b ON b.id = i.brand_id
JOIN categories c ON c.id = i.category_id
JOIN stock s ON s.item_id = i.id
WHERE i.active = 'enabled';
```

```sql
SELECT
i.id AS id ,
ss.name AS store ,
p.name AS name ,
b.name AS brand ,
c.name AS category,
SUM( CASE
WHEN  s.type = 'inbound' THEN s.quantity
WHEN  s.type = 'outbound' THEN -s.quantity
ELSE 0
            END
) AS total
FROM items i
JOIN products p ON p.id = i.product_id
JOIN brands b ON b.id = i.brand_id
JOIN categories c ON c.id = i.category_id
JOIN stock s ON s.item_id = i.id
JOIN stores ss ON s.store_id = ss.id
WHERE i.active = 'enabled' group by s.store_id , i.id ;
```

## Tabla “invoice_suppliers”: 

crear una referencia de documento de venta con un cliente.

```sql
CREATE TABLE `invoice_suppliers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `user_id` INT(11) NOT NULL ,
  `supplier_id` INT(11) NOT NULL ,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ,
  `active` ENUM('enabled','disabled','suspended') NOT NULL DEFAULT 'enabled' ,
  PRIMARY KEY (`id`),
  INDEX `idx_supplier_id` (`supplier_id`) ,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON DELETE CASCADE );
```

## Tabla “invoice_customer”: 

crear una referencia de documento de venta con un cliente.

```sql
CREATE TABLE `invoice_customer` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `user_id` INT(11) NOT NULL ,
  `customer_id` INT(11) NOT NULL ,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at` TIMESTAMP NULL DEFAULT NULL ,
  `active` ENUM('enabled','disabled','suspended') NOT NULL DEFAULT 'enabled' ,
  PRIMARY KEY (`id`),
  INDEX `idx_customer_id` (`customer_id`) ,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE );
```

```sql
INSERT INTO `stock`( `type` , `user_id` , `item_id` , `store_id`, `invoice_id`, `quantity`   ) VALUES( 'outbound' , 1 ,  1 ,  1  , LAST_INSERT_ID() , 3 ),( 'outbound' , 1 ,  2 ,  1  , LAST_INSERT_ID() , 2 );
```

```sql
BEGIN;
INSERT INTO `invoice_suppliers`( `user_id` , `supplier_id` ) VALUES( 1 , 1 );
INSERT INTO `invoice_reference`( `user_id` , `invoice_supplier_id` ) VALUES( 1 , LAST_INSERT_ID() );
INSERT INTO `stock`( `user_id` , `item_id` , `store_id`, `invoice_id`, `quantity`   ) VALUES( 1 ,  1 ,  1  , LAST_INSERT_ID() , 100 );
END;
```

```sql
// qUERY  TRABJANDO AQUI
```

```sql
SELECT
  s.id AS stock_id,
  s.item_id,
  s.store_id,
  s.invoice_id,
  ROUND((s.quantity * i.price), 0) AS total, -- Usamos ROUND para redondear sin formato de texto
  CASE
    WHEN ir.invoice_customer_id IS NOT NULL THEN 'outbound'
    WHEN ir.invoice_supplier_id IS NOT NULL THEN 'inbound'
    ELSE 'unknown' -- Por si acaso hay un caso no contemplado
  END AS operation_type -- Nombre más descriptivo para la columna
FROM
  stock s
JOIN
  items i ON i.id = s.item_id
JOIN
  invoice_reference ir ON ir.id = s.invoice_id
ORDER BY
  s.id; -- Ordenamos por el ID de stock (opcional
```

```sql
SELECT
i.id AS boleta ,
c.name  ,
FORMAT( SUM(items.price * s.quantity) , 0 ) AS total
FROM invoice i
   JOIN stock s ON i.id = s.invoice_id
   JOIN items ON s.item_id = items.id
   JOIN customers c ON i.customer_id = c.id
WHERE i.active='enabled'
   AND c.active='enabled'
   AND s.active='enabled'
   AND items.active='enabled' ;
```

```sql
SELECT i.id AS boleta , c.name  , FORMAT( (items.price * s.quantity) , 0 ) AS total
FROM invoice i
JOIN stock s ON i.id = s.invoice_id
JOIN items ON s.item_id = items.id
JOIN customers c ON i.customer_id = c.id
WHERE i.active='enabled';
```
