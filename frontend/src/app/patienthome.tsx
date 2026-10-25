import HotspotScreen from '../components/HotspotScreen';

export default function Patienthome() {
  return (
    <HotspotScreen
      image={require('../../assets/images/patientcall.png')}
      frameWidth={402}
      frameHeight={874}
      debug
      hotspots={[
        { x: 77, y: 240, w: 249, h: 249, to: 'back' },
      ]}
    />
  );
}