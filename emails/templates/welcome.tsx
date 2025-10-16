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
              primary: 'oklch(64.821% 0.17043 144.05)',
              'primary-foreground': 'oklch(1 0 0)',
              foreground: 'oklch(23.929% 0.00003 271.152)',
              'muted-foreground': 'oklch(44.226% 0.00005 271.152)',
              border: 'oklch(0.922 0 0)',
              card: 'oklch(1 0 0)',
              background: 'oklch(96.416% 0.00011 271.152)',
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
                    width="40"
                    height="40"
                    alt="logo"
                    style={{ display: 'block' }}
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
              <Text className="text-base">
                <span>⭐</span> Oceniać i recenzować przeczytane tytuły
              </Text>
              <Text className="text-base">
                <span>📖</span> Dodawać książki do swojej wirtualnej półki
              </Text>
              <Text className="text-base">
                <span>🔍</span> Wyszukiwać książki według gatunku, oceny czy
                statusu
              </Text>
            </Section>
            <Section className="text-center mt-10">
              <Link
                href="https://bookworm.today/books"
                className="bg-primary text-primary-foreground px-8 py-2 rounded-md text-lg font-medium"
              >
                Przejdź do aplikacji →
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
