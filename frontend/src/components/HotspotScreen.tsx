import { Image, Pressable, View, StyleSheet, useWindowDimensions } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { useRouter } from 'expo-router';

type Hotspot = {
  x: number; // left edge, in Figma units
  y: number; // top edge
  w: number; // width
  h: number; // height
  to: string; // a page like '/menu', or 'back'
};

type Props = {
  image: ImageSourcePropType;
  frameWidth: number;
  frameHeight: number;
  hotspots: Hotspot[];
  debug?: boolean;
};

export default function HotspotScreen({ image, frameWidth, frameHeight, hotspots, debug }: Props) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  // Scale the Figma frame to fit the screen without distortion
  const scale = Math.min(width / frameWidth, height / frameHeight);
  const boxW = frameWidth * scale;
  const boxH = frameHeight * scale;

  return (
    <View style={styles.container}>
      <View style={{ width: boxW, height: boxH }}>
        <Image source={image} style={{ width: boxW, height: boxH }} resizeMode="stretch" />
        {hotspots.map((h, i) => (
          <Pressable
            key={i}
            onPress={() => (h.to === 'back' ? router.back() : router.push(h.to as any))}
            style={{
              position: 'absolute',
              left: h.x * scale,
              top: h.y * scale,
              width: h.w * scale,
              height: h.h * scale,
              backgroundColor: debug ? 'rgba(0,255,115,0.35)' : 'transparent',
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
});