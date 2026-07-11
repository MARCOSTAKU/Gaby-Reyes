import React from 'react';
import {
    View,
    StyleSheet,
    ViewStyle
} from 'react-native';

interface Props{

    children:React.ReactNode;

    style?:ViewStyle;

}

export default function Card({

children,

style

}:Props){

return(

<View style={[styles.card,style]}>

{children}

</View>

);

}

const styles=StyleSheet.create({

card:{

backgroundColor:'#FFF',

borderRadius:22,

padding:18,

borderWidth:1,

borderColor:'#EDF1F7',

shadowColor:'#7D8CA6',

shadowOpacity:.12,

shadowOffset:{width:0,height:10},

shadowRadius:24,

elevation:5

}

});