# 📚 BookWorm  

> Pełnoprawna aplikacja do katalogowania książek z panelem administracyjnym i własną biblioteką czytelnika.  
> 🔗 Live: [https://bookworm.today](https://bookworm.today)

---

## ✨ Funkcje

- 🧭 **Panel administratora** – dodawanie książek, wydań, autorów i wydawców  
- 📸 **Okładki i zdjęcia autorów** – upload na **Cloudinary**  
- 🧾 **Profile książek i wydań** – osobne strony z opisem, formatem, językiem, ISBN, itd.  
- 🔍 **Wyszukiwanie i filtrowanie** – tytuł, ocena, status, gatunek  
- ⭐ **Recenzje i oceny** – system ocen i komentarzy użytkowników  
- 📚 **Moja półka** – statusy *czytam / przeczytane / chcę przeczytać / porzucone*  
- 🌗 **Dark mode** + pełne **RWD**  
- 🔐 **Logowanie Google (NextAuth)** + systemowe maile powitalne (Resend)  
- ⚡ **Optimistic UI** przy interakcjach użytkownika  
- 🧩 **Cloudinary + Prisma + Neon + Resend + Vercel**  
- 🧠 **Bezpieczeństwo:** podpisane uploady, walidacja Zod, role admina  

---

## 🛠️ Stack technologiczny

| Warstwa | Technologie |
|----------|-------------|
| 🌐 **Frontend** | Next.js 15 (App Router), React 19, TailwindCSS v4, shadcn/ui, Radix UI |
| 💾 **Baza danych** | Postgres (Neon) + Prisma ORM |
| 🔐 **Autoryzacja** | Next-Auth v5 (Google OAuth) + Prisma Adapter |
| ☁️ **Media Storage** | Cloudinary (signed uploads + limit rozmiaru pliku) |
| ✉️ **E-maile** | Resend + React Email |
| 🧮 **Formularze** | React Hook Form + Zod |
| 🎨 **UI** | Tailwind + shadcn + lucide-react |
| 🚀 **Hosting** | Vercel (produkcyjny deployment) |

---

## 🚧 Architektura

- **Next.js App Router** + **Server Actions** (mutacje danych)
- **Optimistic updates** po stronie klienta  
- **Dynamiczne strony** (aktualnie) – planowane przejście na **ISR** dla stron autora 👨‍💻  
- **Cloudinary:** przechowywanie plików, w bazie tylko `publicId` + `secureUrl`

---

## 🧱 Roadmap (co dalej?)

BookWorm to projekt aktywnie rozwijany — poniżej kilka planowanych kroków 👇

- [ ] 🌍 **Strony autora z ISR** – lepsze SEO i szybsze ładowanie dzięki incremental static regeneration  
- [ ] 📝 **Markdown (MDX)** dla opisów książek i bio autorów  
- [ ] 🧪 **Testy jednostkowe i E2E** (Vitest + Playwright)  
- [ ] 📊 **Lighthouse CI + testy wydajności / coverage**  
- [ ] 🌐 **Tłumaczenie PL/EN** – pełne i18n  

---

## 📸 Screeny

Zrzuty ekranu znajdziesz w katalogu `/docs/screenshots`.

> 📍 Zobacz wersję live, jeśli chcesz zobaczyć więcej:  
> 🔗 **[https://bookworm.today](https://bookworm.today)**

---

## 🤝 Autor

👨‍💻 **[Kamil Wolański]**  
Frontend Developer – Next.js / React / TypeScript 
📫 [kwolanski3@gmail.com]  

---

## 🪪 Licencja

**MIT**.  
© 2025 

---
