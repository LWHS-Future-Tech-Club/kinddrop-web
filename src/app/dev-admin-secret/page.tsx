import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Only allow access if user is the owner (replace with your email or UID)
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'your@email.com';

export default async function DevAdminPage() {
  // Example: get user from cookie or session
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user');
  let userEmail = null;
  if (userCookie && userCookie.value) {
    try {
      const user = JSON.parse(userCookie.value);
      userEmail = user.email;
    } catch {}
  }
  if (userEmail !== OWNER_EMAIL) {
    redirect('/');
  }

  // Simple form to promote user to admin
  return (
    <div className="max-w-lg mx-auto mt-20 p-8 bg-white/10 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-white">Developer Admin Panel</h1>
      <form method="POST" action="/api/make-admin" className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="User email to promote"
          className="w-full px-4 py-2 rounded bg-white/20 text-white"
          required
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-green-600 hover:bg-green-700 text-white font-bold"
        >
          Make Admin
        </button>
      </form>
      <p className="mt-4 text-white/70 text-sm">Only the owner can access this page.</p>
    </div>
  );
}
