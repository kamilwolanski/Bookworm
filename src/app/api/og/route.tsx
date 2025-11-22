// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { origin } = new URL(req.url);
  const logoUrl = `${origin}/static/logo.png`; // ✅ absolutny URL

  return new ImageResponse(<OgImage logoUrl={logoUrl} />, {
    width: 1200,
    height: 630,
  });
}

// --- Ikony (bez zmian) ---
const BookIcon = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#047857"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const BookIconLarge = () => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#047857"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const StarIcon = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ca8a04"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const BookmarkIcon = () => (
  <svg
    width="70"
    height="70"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#059669"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const SmallBookIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#059669"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const SmallStarIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ca8a04"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

function OgImage({ logoUrl }: { logoUrl: string }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 1200, // ✅ liczby, nie stringi
        height: 630, // ✅ liczby, nie aspectRatio
        background:
          'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 50%, #fefce8 100%)',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex', // ✅ WIELE dzieci → musi być display
      }}
    >
      {/* Tło / dekoracje */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: 'flex', // ✅ WIELE dzieci
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            opacity: 0.1,
            display: 'flex',
          }}
        >
          <BookIcon />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 80,
            opacity: 0.1,
            display: 'flex',
          }}
        >
          <BookIconLarge />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 80,
            right: 160,
            opacity: 0.1,
            display: 'flex',
          }}
        >
          <StarIcon />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 96,
            left: 128,
            opacity: 0.1,
            display: 'flex',
          }}
        >
          <BookmarkIcon />
        </div>

        {/* Kółka */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            right: '25%',
            width: 256,
            height: 256,
            background: 'rgba(167, 243, 208, 0.2)',
            borderRadius: 9999,
            filter: 'blur(60px)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            left: '25%',
            width: 320,
            height: 320,
            background: 'rgba(254, 240, 138, 0.2)',
            borderRadius: 9999,
            filter: 'blur(60px)',
            display: 'flex',
          }}
        />
      </div>

      {/* Zawartość */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 64,
          paddingRight: 0,
        }}
      >
        {/* Lewa kolumna */}
        <div style={{ flex: 1, zIndex: 10, display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1
                style={{
                  fontSize: 84,
                  lineHeight: 1.1,
                  color: '#065f46',
                  margin: 0,
                  fontWeight: 'bold',
                }}
              >
                BookWorm
              </h1>
              <div
                style={{
                  height: 8,
                  width: 128,
                  background: 'linear-gradient(to right, #059669, #eab308)',
                  borderRadius: 9999,
                }}
              />
            </div>

            <p
              style={{
                fontSize: 28,
                lineHeight: 1.4,
                color: '#047857',
                maxWidth: 512,
                margin: 0,
                fontWeight: 400,
              }}
            >
              Przeglądaj książki, twórz swoją bibliotekę i śledź postępy w
              czytaniu
            </p>

            <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255, 255, 255, 0.8)',
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 8,
                  paddingBottom: 8,
                  borderRadius: 9999,
                }}
              >
                <SmallBookIcon />
                <span
                  style={{ fontSize: 18, color: '#065f46', fontWeight: 500 }}
                >
                  Półka książek
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255, 255, 255, 0.8)',
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 8,
                  paddingBottom: 8,
                  borderRadius: 9999,
                }}
              >
                <SmallStarIcon />
                <span
                  style={{ fontSize: 18, color: '#065f46', fontWeight: 500 }}
                >
                  Oceny
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Prawa kolumna (maskotka) */}
        <div style={{ display: 'flex' }}>
          <div
            style={{ position: 'relative', display: 'flex' /* ✅ 2 dzieci */ }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 64,
                bottom: 0,
                left: 0,
                background: 'linear-gradient(135deg, #6ee7b7, #fde047)',
                borderRadius: 9999,
                filter: 'blur(40px)',
                opacity: 0.3,
                transform: 'scale(1.4)',
                paddingRight: 64,
              }}
            />
            <img
              src={logoUrl}
              alt="BookWorm mascot"
              width={420}
              height={420}
              style={{ position: 'relative', marginRight: 84 }}
            />
          </div>
        </div>
      </div>

      {/* Dolna linia */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(to right, #10b981, #22c55e, #eab308)',
        }}
      />
    </div>
  );
}
