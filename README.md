# 👨‍🏫 Find-a-Coach — Vue 3 App

## 📖 About

**Find-a-Coach** is a full-featured web application where users can register as coaches and receive contact requests from potential students.
Built with modern front-end technologies, this app demonstrates dynamic routing, state management, and real-time data handling using Firebase.
It also features secure Firebase authentication with signup, login, auto-logout, and token-based session handling for a smooth user experience.

🔗 [Live App](https://find-a-coach-houssam.netlify.app/)

## 🚀 Features

- 📬 Contact real coaches through a dynamic request form

- 👥 Become a coach and get listed in the coaches directory

- 🧾 Interactive **form validation** with real-time error feedback and input handling

- 🧭 Dynamic routing with **Vue Router**, including coach profiles and request inbox

- 🔐 Basic route protection (only non-coaches can register)

- 💡 Built with **Vue 3 Composition API + `<script setup lang="ts">` + TypeScript**
  
- 📦 State management with **Pinia**

- 🎨 Smooth and responsive UI enhanced with **Vue 3 Transitions**

- 💠 Rich UI icons with **Iconify for Vue**

- 🔁 Handles data persistence and retrieval through **RESTful HTTP requests**

- 🔑 Secure Firebase authentication with signup, login, auto-logout, and token-based session management

- ☁️ Real-time backend powered by **Firebase**



## 🛠 Tech Stack

- **Vue 3** (Composition API + `<script setup lang="ts">`)

- **TypeScript** (strictly typed Vue components)

- **Pinia** (state management)

- **Firebase** (Realtime Database for data storage, REST API, and authentication with secure session handling)

- **Vue 3 Transitions** (built-in animation features)

- **Iconify** (modern SVG icon library for Vue)

- **Vite** (blazing-fast development build tool)

## ✅ Testing with Playwright

This project includes automated **end-to-end tests** written using **[Playwright](https://playwright.dev/)** to ensure the core user flows work as expected.

<details>
<summary><strong>🧪 Click to view detailed test coverage</strong></summary>

- ✔️ **Homepage redirect**: Auto-redirects from `/` to `/coaches`
- ✔️ **Static content**: Verifies key UI elements like headings and links are visible
- ✔️ **Navigation**: Clicking on “Login” correctly redirects to `/auth`
- ✔️ **Authentication**:
  - Login with valid credentials works and redirects to `/coaches`
  - Login with invalid or empty credentials shows proper validation and error messages
  - Signup with empty inputs triggers validation errors
  - Signup with existing credentials displays error alerts
  - Signup with new credentials works and redirects to `/coaches`
- ✔️ **Authorization**:
  - Unauthorized access to `/register` redirects to login
  - Logged-in users can access `/register` to become a coach
- ✔️ **Coach Registration**:
  - Form submission with valid data registers a new coach
  - Redirects to the coaches list showing the new coach profile
- ✔️ **Session Management**:
  - Logout button appears after login
  - Clicking logout successfully signs out the user and hides protected elements
</details>

All tests were successfully executed and passed in the latest run — ensuring a **stable and functional user experience** from end to end.

### 🚀 Run Tests Locally

To execute the Playwright tests locally:

```bash
npx playwright install
npx playwright test
```

For visual debugging:

```bash
npx playwright test --headed
```


## 📷 Preview
![Screenshot 2025-04-05 145718](https://github.com/user-attachments/assets/a0a750ef-cbe7-4b28-8bff-9d1fa5662b3c)


## Recommended IDE Setup

_This template should help get you started developing with Vue 3 in Vite._

[VSCode](https://code.visualstudio.com/) + [Vue](https://marketplace.visualstudio.com/items?itemName=Vue.volar).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Vue](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
