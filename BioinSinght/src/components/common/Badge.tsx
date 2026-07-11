import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface Props{

title:string;

color?:string;

background?:string;

}

export default function Badge({

title,

color='#2F6CF0',

background='#EEF4FF'

}:Props){

return(

<View
style={[
styles.badge,
{backgroundColor:background}
]}
>

<Text
style={[
styles.text,
{color}
]}
>

{title}

</Text>

</View>

);

}

const styles=StyleSheet.create({

badge:{

paddingHorizontal:12,

paddingVertical:5,

borderRadius:100,

alignSelf:'flex-start'

},

text:{

fontSize:11,

fontWeight:'800'

}

});