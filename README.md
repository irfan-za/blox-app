# BloX App

BloX App is designed to streamline user and blog management. It provides a centralized dashboard where his team can efficiently manage user accounts and publish blog posts. The application displays a table listing all users and blogs, accompanied by a simple chart to visualize publishing activity or user engagement. This MVP is built with the intention to evolve with additional features over time.

### Demo Project

**Link Demo:** [https://blox-app-gamma.vercel.app](https://blox-app-gamma.vercel.app)

To explore the application, you can use the following demo account:

- **Email:** `irfan@gmail.com`
- **Access Token:** `1d84ac2a788b76c25af2dcf2396cf05a1dcac21bf15705bf3eb8127970cbab94`

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/irfan-za/blox-app.git
    cd blox-app
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Configuration:**

    - Create a `.env` file by copying the contents of `.env.example`.
    - Obtain a GoRest access token from [https://gorest.co.in](https://gorest.co.in) (login required).
    - Assign the token to the `GOREST_ACCESS_TOKEN` variable in your `.env` file.

4.  **Run the development server:**

    ```bash
    pnpm dev
    ```

5.  **Access the application:**

    Open [http://localhost:3000](http://localhost:3000) in your browser.
