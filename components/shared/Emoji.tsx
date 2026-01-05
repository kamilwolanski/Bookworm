import twemoji from 'twemoji';

const Emoji = ({ children }: { children: string }) => {
  const html = twemoji.parse(children, {
    folder: 'svg',
    ext: '.svg',
    base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
  });
  return (
    <span
      className="emoji text-sm leading-none [&>img]:w-5 [&>img]:h-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Emoji;
