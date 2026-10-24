import HotspotScreen from '../components/HotspotScreen';

export default function Home() {
  return (
    <HotspotScreen
      image={require('../../assets/images/home.png')}
      frameWidth={402}
      frameHeight={874}

      hotspots={[

        { x: 46, y: 480, w: 306, h: 68, to: '/login' },
      ]}
    />
  );
}