# Legal Portal for All About Insurance

This is a lightweight Next.js application to host the Terms of Service and Privacy Policy. It fetches the content directly from your Supabase database, ensuring it is always in sync with the mobile app.

## Local Development

1.  Navigate to this directory:
    ```bash
    cd web-legal
    ```

2.  Install dependencies (if not already done):
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000/terms](http://localhost:3000/terms) or [http://localhost:3000/privacy](http://localhost:3000/privacy) in your browser.

## Deployment to Vercel

1.  Go to [Vercel](https://vercel.com) and sign up/login.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  In the "Configure Project" screen, select the **Root Directory** as `web-legal` (click Edit next to Root Directory).
5.  **Environment Variables**:
    You must add the following environment variables in the Vercel dashboard (copy them from `.env.local` or your project settings):
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6.  Click **Deploy**.

Your legal pages will be live at `https://[your-project].vercel.app/terms` and `.../privacy`.
