import { GenreSlug, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Najpierw dodaj gatunki (genres)

  type GenreWithTranslations = {
    slug: GenreSlug;
    translations: [
      {
        language: string;
        name: string;
      },
    ];
  };
  const genres: GenreWithTranslations[] = [
    {
      slug: GenreSlug.FANTASY,
      translations: [{ language: 'pl', name: 'Fantastyka' }],
    },
    {
      slug: GenreSlug.SCIENCE_FICTION,
      translations: [{ language: 'pl', name: 'Science Fiction' }],
    },
    {
      slug: GenreSlug.THRILLER,
      translations: [{ language: 'pl', name: 'Thriller' }],
    },
    {
      slug: GenreSlug.ROMANCE,
      translations: [{ language: 'pl', name: 'Romans' }],
    },
    {
      slug: GenreSlug.NON_FICTION,
      translations: [{ language: 'pl', name: 'Literatura faktu' }],
    },
    {
      slug: GenreSlug.HORROR,
      translations: [{ language: 'pl', name: 'Horror' }],
    },
    {
      slug: GenreSlug.MYSTERY,
      translations: [{ language: 'pl', name: 'Tajemnica' }],
    },
    {
      slug: GenreSlug.HISTORY,
      translations: [{ language: 'pl', name: 'Historia' }],
    },
    {
      slug: GenreSlug.BIOGRAPHY,
      translations: [{ language: 'pl', name: 'Biografia' }],
    },
    {
      slug: GenreSlug.POETRY,
      translations: [{ language: 'pl', name: 'Poetryka' }],
    },
    {
      slug: GenreSlug.DRAMA,
      translations: [{ language: 'pl', name: 'Dramat' }],
    },
    {
      slug: GenreSlug.ADVENTURE,
      translations: [{ language: 'pl', name: 'Przygodowa' }],
    },
    {
      slug: GenreSlug.CLASSICS,
      translations: [{ language: 'pl', name: 'Klasyka' }],
    },
    {
      slug: GenreSlug.CHILDREN,
      translations: [{ language: 'pl', name: 'Dla dzieci' }],
    },
    {
      slug: GenreSlug.YOUNG_ADULT,
      translations: [{ language: 'pl', name: 'Młodzieżowa' }],
    },
    {
      slug: GenreSlug.SELF_HELP,
      translations: [{ language: 'pl', name: 'Poradniki' }],
    },
    {
      slug: GenreSlug.HEALTH,
      translations: [{ language: 'pl', name: 'Zdrowie' }],
    },
    {
      slug: GenreSlug.TECHNOLOGY,
      translations: [{ language: 'pl', name: 'Technologia' }],
    },
    {
      slug: GenreSlug.PHILOSOPHY,
      translations: [{ language: 'pl', name: 'Filozofia' }],
    },
    {
      slug: GenreSlug.RELIGION,
      translations: [{ language: 'pl', name: 'Religia' }],
    },
    { slug: GenreSlug.ART, translations: [{ language: 'pl', name: 'Sztuka' }] },
    {
      slug: GenreSlug.TRAVEL,
      translations: [{ language: 'pl', name: 'Podróże' }],
    },
    {
      slug: GenreSlug.SATIRE,
      translations: [{ language: 'pl', name: 'Satira' }],
    },
    {
      slug: GenreSlug.GOTHIC,
      translations: [{ language: 'pl', name: 'Gotyk' }],
    },
    {
      slug: GenreSlug.DYSTOPIA,
      translations: [{ language: 'pl', name: 'Dystopia' }],
    },
    {
      slug: GenreSlug.MEMOIR,
      translations: [{ language: 'pl', name: 'Pamiętnik' }],
    },
    {
      slug: GenreSlug.CRIME,
      translations: [{ language: 'pl', name: 'Kryminał' }],
    },
    {
      slug: GenreSlug.DETECTIVE,
      translations: [{ language: 'pl', name: 'Detektywistyczna' }],
    },
    { slug: GenreSlug.ESSAY, translations: [{ language: 'pl', name: 'Esej' }] },
    {
      slug: GenreSlug.HUMOR,
      translations: [{ language: 'pl', name: 'Humor' }],
    },
    {
      slug: GenreSlug.COOKING,
      translations: [{ language: 'pl', name: 'Kucharska' }],
    },
    {
      slug: GenreSlug.BUSINESS,
      translations: [{ language: 'pl', name: 'Biznes' }],
    },
    {
      slug: GenreSlug.EDUCATION,
      translations: [{ language: 'pl', name: 'Edukacja' }],
    },
    {
      slug: GenreSlug.PSYCHOLOGY,
      translations: [{ language: 'pl', name: 'Psychologia' }],
    },
    {
      slug: GenreSlug.POLITICS,
      translations: [{ language: 'pl', name: 'Polityka' }],
    },
    {
      slug: GenreSlug.SPORT,
      translations: [{ language: 'pl', name: 'Sport' }],
    },
    {
      slug: GenreSlug.TRUE_CRIME,
      translations: [{ language: 'pl', name: 'Prawdziwe zbrodnie' }],
    },
    {
      slug: GenreSlug.FAIRY_TALES,
      translations: [{ language: 'pl', name: 'Baśnie' }],
    },
    {
      slug: GenreSlug.WESTERN,
      translations: [{ language: 'pl', name: 'Western' }],
    },
    {
      slug: GenreSlug.LGBTQ,
      translations: [{ language: 'pl', name: 'LGBTQ+' }],
    },
    {
      slug: GenreSlug.CULTURE,
      translations: [{ language: 'pl', name: 'Kultura' }],
    },
    {
      slug: GenreSlug.COMICS,
      translations: [{ language: 'pl', name: 'Komiksy' }],
    },
    {
      slug: GenreSlug.GRAPHIC_NOVEL,
      translations: [{ language: 'pl', name: 'Powieść graficzna' }],
    },
    {
      slug: GenreSlug.ESSAYS,
      translations: [{ language: 'pl', name: 'Eseje' }],
    },
    {
      slug: GenreSlug.LITERARY_FICTION,
      translations: [{ language: 'pl', name: 'Literatura piękna' }],
    },
    {
      slug: GenreSlug.SPIRITUALITY,
      translations: [{ language: 'pl', name: 'Duchowość' }],
    },
    {
      slug: GenreSlug.ENVIRONMENT,
      translations: [{ language: 'pl', name: 'Ekologia' }],
    },
    {
      slug: GenreSlug.MUSIC,
      translations: [{ language: 'pl', name: 'Muzyka' }],
    },
    {
      slug: GenreSlug.CLASSIC_FICTION,
      translations: [{ language: 'pl', name: 'Klasyczna literatura' }],
    },
    {
      slug: GenreSlug.CONTEMPORARY_FICTION,
      translations: [{ language: 'pl', name: 'Współczesna literatura' }],
    },
    {
      slug: GenreSlug.URBAN_FANTASY,
      translations: [{ language: 'pl', name: 'Miejska fantastyka' }],
    },
    {
      slug: GenreSlug.HISTORICAL_FICTION,
      translations: [{ language: 'pl', name: 'Fikcja historyczna' }],
    },
    {
      slug: GenreSlug.MAGICAL_REALISM,
      translations: [{ language: 'pl', name: 'Realizm magiczny' }],
    },
    {
      slug: GenreSlug.SHORT_STORIES,
      translations: [{ language: 'pl', name: 'Opowiadania' }],
    },
    {
      slug: GenreSlug.FANFICTION,
      translations: [{ language: 'pl', name: 'Fanfiction' }],
    },
    {
      slug: GenreSlug.SCIENCE,
      translations: [{ language: 'pl', name: 'Nauka' }],
    },
    {
      slug: GenreSlug.ASTRONOMY,
      translations: [{ language: 'pl', name: 'Astronomia' }],
    },
    {
      slug: GenreSlug.MATHEMATICS,
      translations: [{ language: 'pl', name: 'Matematyka' }],
    },
    {
      slug: GenreSlug.ECONOMICS,
      translations: [{ language: 'pl', name: 'Ekonomia' }],
    },
    {
      slug: GenreSlug.PARENTING,
      translations: [{ language: 'pl', name: 'Rodzicielstwo' }],
    },
    {
      slug: GenreSlug.MINDFULNESS,
      translations: [{ language: 'pl', name: 'Uważność' }],
    },
    {
      slug: GenreSlug.PRODUCTIVITY,
      translations: [{ language: 'pl', name: 'Produktywność' }],
    },
    {
      slug: GenreSlug.PERSONAL_DEVELOPMENT,
      translations: [{ language: 'pl', name: 'Rozwój osobisty' }],
    },
    {
      slug: GenreSlug.ANTHROPOLOGY,
      translations: [{ language: 'pl', name: 'Antropologia' }],
    },
    {
      slug: GenreSlug.SOCIOLOGY,
      translations: [{ language: 'pl', name: 'Socjologia' }],
    },
    {
      slug: GenreSlug.GENDER_STUDIES,
      translations: [{ language: 'pl', name: 'Studia nad płcią' }],
    },
    {
      slug: GenreSlug.RACE_AND_ETHNICITY,
      translations: [{ language: 'pl', name: 'Rasa i tożsamość etniczna' }],
    },
    {
      slug: GenreSlug.DESIGN,
      translations: [{ language: 'pl', name: 'Design' }],
    },
    {
      slug: GenreSlug.PHOTOGRAPHY,
      translations: [{ language: 'pl', name: 'Fotografia' }],
    },
    {
      slug: GenreSlug.ARCHITECTURE,
      translations: [{ language: 'pl', name: 'Architektura' }],
    },
    {
      slug: GenreSlug.FASHION,
      translations: [{ language: 'pl', name: 'Moda' }],
    },
    {
      slug: GenreSlug.GAMEBOOK,
      translations: [{ language: 'pl', name: 'Książka paragrafowa' }],
    },
    {
      slug: GenreSlug.ZINES,
      translations: [{ language: 'pl', name: 'Ziny' }],
    },
    {
      slug: GenreSlug.MYTHOLOGY,
      translations: [{ language: 'pl', name: 'Mitologia' }],
    },
    {
      slug: GenreSlug.FOLKLORE,
      translations: [{ language: 'pl', name: 'Folklor' }],
    },
    {
      slug: GenreSlug.AUTOBIOGRAPHY,
      translations: [{ language: 'pl', name: 'Autobiografia' }],
    },
    {
      slug: GenreSlug.ANIMALS,
      translations: [{ language: 'pl', name: 'Zwierzęta' }],
    },
    {
      slug: GenreSlug.LANGUAGE,
      translations: [{ language: 'pl', name: 'Języki i językoznawstwo' }],
    },
  ];

  for (const genreData of genres) {
    await prisma.genre.upsert({
      where: { slug: genreData.slug },
      update: {},
      create: {
        slug: genreData.slug,
        translations: {
          create: genreData.translations,
        },
      },
    });
  }

  console.log('Seeded genres and translations');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
