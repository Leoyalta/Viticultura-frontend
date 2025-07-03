// generate-env.js

const fs = require("fs"); // Модуль для роботи з файловою системою
const path = require("path"); // Модуль для роботи зі шляхами файлів

// Шлях до файлу environment.prod.ts, який ми будемо генерувати/оновлювати
// __dirname посилається на поточну директорію, тобто корінь вашого проєкту
const environmentProdPath = path.join(
  __dirname,
  "src",
  "environments",
  "environment.prod.ts"
);

// Отримання змінних середовища з process.env.
// Vercel автоматично робить змінні, які ви встановили в налаштуваннях проєкту,
// доступними через process.env під час збірки.
//
// MAPBOX_API_KEY - це назва змінної, яку ви налаштуєте у Vercel.
// Якщо змінна не встановлена (наприклад, при локальній розробці без dotenv),
// ми використовуємо порожній рядок або дефолтне значення.
const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY || "";
const PUBLIC_SERVICE_URL =
  process.env.PUBLIC_SERVICE_URL || "https://default-public-service.com";
// Додайте тут будь-які інші змінні, які ви будете використовувати з Vercel
// const MY_OTHER_SECRET = process.env.MY_OTHER_SECRET || 'fallback_secret';

// Вміст файлу environment.prod.ts
// Використовуємо шаблонні рядки (backticks `) для зручності
const content = `
// Цей файл згенеровано автоматично під час збірки.
// Будь ласка, не редагуйте його вручну.

export const environment = {
  production: true,
  // Вставляємо значення змінних середовища сюди.
  // Вони будуть частиною фінального JavaScript-бандлу.
  mapboxApiKey: '${MAPBOX_API_KEY}',
  publicServiceUrl: '${PUBLIC_SERVICE_URL}',
  // myOtherSecret: '${MY_OTHER_SECRET}', // Якщо ви додали інші змінні
  // Можливо, у вас є інші статичні прод-змінні, які не йдуть з Vercel
  // наприклад: apiUrl: 'https://api.your-production-domain.com/api',
};
`;

// Запис вмісту у файл environment.prod.ts
try {
  fs.writeFileSync(environmentProdPath, content, "utf8");
  console.log("Successfully generated src/environments/environment.prod.ts");
} catch (err) {
  console.error("Error generating environment.prod.ts:", err);
  process.exit(1); // Вихід з помилкою, якщо файл не вдалося створити
}
