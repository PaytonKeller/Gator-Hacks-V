import HotspotScreen from '../components/HotspotScreen';

export default function Login() {
  return (
    <HotspotScreen
      image={require('../../assets/images/login.png')}
      frameWidth={402}
      frameHeight={874}
      debug
      hotspots={[
        { x: 16, y: 56, w: 48, h: 48, to: 'back' },
      ]}
    />
  );
}