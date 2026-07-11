import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

interface Props {
  title: string;
  onBack?: () => void;
}

export default function Header({
  title,
  onBack,
}: Props) {
  return (
    <View style={styles.container}>

      {onBack ? (
        <Pressable
          style={styles.back}
          onPress={onBack}
        >
          <Text style={styles.arrow}>←</Text>
        </Pressable>
      ) : (
        <View style={styles.placeholder}/>
      )}

      <Text style={styles.title}>
        {title}
      </Text>

      <View style={styles.placeholder}/>

    </View>
  );
}

const styles = StyleSheet.create({

container:{
flexDirection:'row',
alignItems:'center',
justifyContent:'space-between',
paddingHorizontal:20,
paddingVertical:15
},

back:{
width:34,
height:34,
borderRadius:17,
backgroundColor:'#EEF2F9',
justifyContent:'center',
alignItems:'center'
},

arrow:{
fontSize:20,
color:'#6C7B92',
fontWeight:'700'
},

title:{
fontSize:20,
fontWeight:'800',
color:'#233349'
},

placeholder:{
width:34
}

});