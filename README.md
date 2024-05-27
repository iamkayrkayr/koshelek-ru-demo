# Тестовое задание на позицию “Front-end разработчик Vue.js” в компанию Кошелёк.Ру

## Описание и особенности

Приложение на Nuxt.js (version 3) и Vuetify.
Вдохновение: order-book в Binance - https://www.binance.com/ru/orderbook/BTC_USDT

* Адаптивность
* Single-page
* Страницы подгружаются динамически отдельными чанками
* Интеграция с Binance API - используется web-socket для получения данных в реальном времени
* SSR - для live-демо работает node-js сервер, посаженный как отдельный процесс в supervisor
* Используется LocalStorage для сохранения истории изменения валютной пары

Live-демо: https://koshelek-ru-demo.kayrkayr.com/
