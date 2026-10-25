import HotspotScreen from '../components/HotspotScreen';

export default function Patient() {
  return (
    <HotspotScreen
      image={require('../../assets/images/patient.png')}
      frameWidth={402}
      frameHeight={874}
      hotspots={[
        { x: 16, y: 56, w: 48, h: 48, to: 'back' },
      ]}
    />
  );
}