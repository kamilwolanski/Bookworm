// app/api/hello/route.ts

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html>
      <head><title>Hello</title></head>
      <body>
        <h1>Witaj z API!</h1>
      </body>
    </html>
  `;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
