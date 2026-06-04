Tour26 is a customizable framework for groups to centralize tracked tours, share photos, view statistics, and rank their trips in a Tier List.

## Setup and Deployment

### 1. Create a Supabase Project
- Sign up or log in at [Supabase.com](https://supabase.com/)
- Create a new project
- next Steps coming soon

### 2. Configure Environment Variables
- Create a new file and name it `.env`.
- Paste the following template into the file and insert your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key`
```
### 3. Deploy the Website
You can now host this project using providers like Netlify or Cloudflare Pages:
- Upload your configured Project Folder to your provider
- Add the environment variables listed above `(NEXT_PUBLIC_SUPABASE_URL, etc.)` in the provider's project settings dashboard.
