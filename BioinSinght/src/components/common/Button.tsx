import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  disabled = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled && styles.disabled
      ]}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  button:{
    height:52,
    borderRadius:16,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#2F6CF0'
  },

  disabled:{
    opacity:.5
  },

  text:{
    color:'#fff',
    fontSize:16,
    fontWeight:'800'
  }

});