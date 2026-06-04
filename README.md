Tour26 is a customizable framework for groups to centralize tracked tours, schedule new tours, share photos, view statistics, and rank their trips in a Tier List.

## Issues
If you notice any bugs or missing features, you can let us know by opening an issue [here.](https://github.com/Tour26-Team/Tour26-web/issues)

## Setup and Deployment

### 1. Create a Supabase Project
- Sign up or log in at [Supabase.com](https://supabase.com/)
- Create a new project <br><br>

- **Authentication**
  - Go to Authentication → Configuration
  - Enable Email as a sign-in provider
  
- **Storage**
  - Go to Storage
  - Create a bucket called `touren`
  - Create folders for your tour photos and videos
  - Each folder should contain:
    - `info.json` with your tour data:
    ```JSONC
    {
      "name": "name",
      "date": "00.00.0000",
      "totalTimeHour": "0",
      "totalTimeMinute": "00",
      "movementTimeHour": "0",
      "movementTimeMinute": "00",
      "range": "00,0",
      "averageSpeed": "00",
      "members": "0",
      "routeLink": "https://example.com" }
    ```
    - `collage.jpg` (square collage)
    - `tour.webp` (tour image)

### 2. Configure Environment Variables
- Create a new file and name it `.env`
- Paste the following template into the file and insert your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```
### 3. Deploy the Website
You can now host this project using providers like Netlify or Cloudflare Pages:
- Upload your configured Project Folder to your provider
- Add the environment variables listed above `(NEXT_PUBLIC_SUPABASE_URL, etc.)` in the provider's project settings dashboard
