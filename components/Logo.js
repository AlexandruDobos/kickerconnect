import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image source={require('../assets/images/logo1.png')} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 200,
    //marginBottom: 12,
    //marginTop: '40%'
  },
});

export default memo(Logo);