import HotspotScreen from '../components/HotspotScreen';

export default function Login() {
  return (
    <HotspotScreen
      image={require('../../assets/images/login.png')}
      frameWidth={402}
      frameHeight={874}
      debug
      hotspots={[
        { x: 52, y: 598, w: 46, h: 46, to: 'patienthome' },
      ]}
    />
  );
}