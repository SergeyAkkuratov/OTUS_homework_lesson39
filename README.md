# OTUS_homework_lesson39

ДЗ для задания https://github.com/vvscode/otus--javascript-basic/blob/master/lessons/lesson39/hw.md

# Single Page Application Router from Sergey Akkuratov

Router для реализации SPA приложения на TypeScript.

## Installation

`npm install @sergey.akkuratov/router`

or 

`yarn add @sergey.akkuratov/router`

## Usage

Инициализация Router

```javascript
import Router from "./router";

const router = new Router({ mode: "history" });
```

Добавления правил (роутов) для переходов по адрессам.

```javascript
router.addRoute({
    path: "/about", // путь, на который переходим (сожет быть строкой, RegExp или функцией, возвращающей boolean)
    onBeforeEnter: async () => { // фунция, которую надо выполнить перед переходом по path
        console.log("Before entering about route");
    },
    onEnter: async () => { // фунция, которую надо выполнить после перехода по path
        console.log("Entered about route");
    },
    onLeave: async () => { // фунция, которую надо выполнить после ухода с path
        console.log("Leaving about route");
    },
});
```

Удаление правил (роутов).

```javascript
const deleteRoute = router.addRoute({
    path: "/about"
});

deleteRoute() // удаляем роут
```

Изменение адреса без вызова стандартных сообытий перехода.

```javascript
router.navigate("/about") // произойдёт только изменение адреса без обращения к серверу, но с обработкой роутов
```