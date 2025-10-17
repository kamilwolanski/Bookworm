import {
  Body,
  Container,
  Heading,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  pixelBasedPreset,
} from '@react-email/components';
import { getImageUrl } from '../utils';

interface WelcomeProps {
  username: string;
}

export const WelcomeEmail = ({ username }: WelcomeProps) => (
  <Html>
    <Head />
    <Preview>
      Każda książka to nowa podróż — czas wybrać tę pierwszą w BookWorm.
    </Preview>
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
        theme: {
          extend: {
            colors: {
              primary: '#16a34a',
              'primary-foreground': '#ffffff',
              foreground: '#3a3a3a',
              'muted-foreground': '#6b7280',
              border: '#e5e7eb',
              card: '#ffffff',
              background: '#f5f6f8',
            },
          },
        },
      }}
    >
      <Body style={main} className="bg-background mx-auto">
        <Container className="bg-card">
          <Section className="px-10 py-2">
            <table
              cellPadding="0"
              cellSpacing="0"
              role="presentation"
              className="mx-auto"
            >
              <tr>
                <td>
                  <Img
                    src={getImageUrl('logo.png')}
                    width={40}
                    height={40}
                    alt="logo"
                    style={{
                      display: 'block',
                      border: '0',
                      outline: 'none',
                      textDecoration: 'none',
                    }}
                  />
                </td>
                <td style={{ paddingLeft: '8px', verticalAlign: 'middle' }}>
                  <Text className="text-primary text-lg font-bold">
                    BookWorm
                  </Text>
                </td>
              </tr>
            </table>
          </Section>
          <Section className="bg-green-100 px-10">
            <Img
              src={getImageUrl('welcome-worm.png')}
              width="260"
              alt="logo"
              style={{ display: 'block' }}
              className="mx-auto"
            />
          </Section>
          <Section className="px-10">
            <Heading className="text-3xl text-primary text-center">
              Cześć {username}!
            </Heading>
            <Text className="text-center text-foreground text-base">
              Witamy w społeczności <b className="text-primary">BookWorm</b> —
              miejscu, gdzie książki żyją dłużej niż na półce.
            </Text>
            <Text className="text-center text-primary text-lg">
              <b>Teraz możesz:</b>
            </Text>
            <Section>
              <Text className="text-base text-foreground">
                <span>⭐</span> Oceniać i recenzować przeczytane tytuły
              </Text>
              <Text className="text-base text-foreground">
                <span>📖</span> Dodawać książki do swojej wirtualnej półki
              </Text>
              <Text className="text-base text-foreground">
                <span>🔍</span> Wyszukiwać książki według gatunku, oceny czy
                statusu
              </Text>
            </Section>
            <Section className="text-center mt-10">
              <Link
                href="https://bookworm.today/books"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  lineHeight: '24px',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Zacznij korzystać →
              </Link>

              <Text className="text-muted-foreground">
                Zaloguj się i odkryj swoją pierwszą książkę
              </Text>
            </Section>
          </Section>
          <Section className="px-10">
            <Hr className="border-border my-5" />
          </Section>
          <Section className="px-10 text-center text-muted-foreground mt-5">
            <Text>
              Miłego czytania,
              <br />
              <strong>Zespół BookWorm</strong>
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default WelcomeEmail;

const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};
