import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'experimental-edge'
};

// Make sure the font exists in the specified path:
const font = fetch(new URL('../../assets/spaceMono.TTF', import.meta.url)).then(
  (res) => res.arrayBuffer()
);

export default async function handler(req) {
  const fontData = await font;
  const { searchParams } = req.nextUrl;
  const projectName = searchParams.get('projectName') || 'Smart Escrow';
  const escrowValue = searchParams.get('escrowValue') || 'Not Available';
  const safetyValveDate =
    searchParams.get('safetyValveDate') || 'Not Available';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          color: 'black',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          background: '#2b2c34'
        }}
      >
        <div
          style={{
            height: 500,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingLeft: 50
          }}
        >
          <p
            style={{ fontSize: 80, color: '#ff3864', fontFamily: 'SpaceMono' }}
          >
            {projectName}
          </p>
          <p
            style={{ fontSize: 25, color: 'white' }}
          >{`Total Value: ${escrowValue}`}</p>
          <p style={{ fontSize: 25, color: 'white' }}>
            {`Safety Valve Date: ${new Date(
              safetyValveDate * 1000
            ).toDateString()}`}
          </p>
        </div>

        <div
          style={{
            height: 130,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(10, 10, 10, 0.960784)'
          }}
        >
          <img
            width='50'
            height='50'
            src='https://res.cloudinary.com/saimano/image/upload/v1625725336/RaidGuild/logos/swords_ztjlko.png'
            alt='raidguild'
          />
          <img
            width='150'
            height='50'
            src='https://res.cloudinary.com/saimano/image/upload/v1667118891/RaidGuild/logos/logo_mlx6yl.svg'
            alt='raidguild'
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'SpaceMono',
          data: fontData,
          style: 'normal'
        }
      ]
    }
  );
}
