import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Props {

  icon: string;

  label: string;

  onPress: () => void;

}

export default function QuickAction({

  icon,

  label,

  onPress,

}: Props) {

  return (

    <Pressable
      style={styles.container}
      onPress={onPress}
    >

      <View style={styles.iconContainer}>

        <Text style={styles.icon}>

          {icon}

        </Text>

      </View>

      <Text style={styles.label}>

        {label}

      </Text>

    </Pressable>

  );

}

const styles = StyleSheet.create({

container:{

flex:1,

backgroundColor:'#FFFFFF',

borderRadius:18,

alignItems:'center',

paddingVertical:18,

shadowColor:'#AAB8D0',

shadowOpacity:.12,

shadowRadius:15,

shadowOffset:{
width:0,
height:8
},

elevation:4

},

iconContainer:{

width:46,

height:46,

borderRadius:15,

backgroundColor:'#EEF4FF',

justifyContent:'center',

alignItems:'center',

marginBottom:12

},

icon:{

fontSize:22,

fontWeight:'800',

color:'#2F6CF0'

},

label:{

fontSize:13,

fontWeight:'700',

color:'#2C3E50'

}

});