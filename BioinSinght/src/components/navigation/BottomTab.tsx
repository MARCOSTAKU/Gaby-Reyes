import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type BottomTabRoute =
  | 'Dashboard'
  | 'History'
  | 'Alerts'
  | 'Evolution'
  | 'Profile';

interface Props {
  active: BottomTabRoute;
  onNavigate: (route: BottomTabRoute) => void;
  onAdd?: () => void;
}

function TabItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.tab}
      onPress={onPress}
    >
      <Text
        style={[
          styles.icon,
          active && styles.iconActive,
        ]}
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.label,
          active && styles.labelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function BottomTab({
  active,
  onNavigate,
  onAdd,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}> 

      <TabItem
        icon="⌂"
        label="Inicio"
        active={active === 'Dashboard'}
        onPress={() => onNavigate('Dashboard')}
      />

      <TabItem
        icon="▤"
        label="Historial"
        active={active === 'History'}
        onPress={() => onNavigate('History')}
      />

      <View style={styles.fabContainer}>
        <Pressable
          style={styles.fab}
          onPress={onAdd}
        >
          <Text style={styles.fabIcon}>＋</Text>
        </Pressable>
      </View>

      <TabItem
        icon="◌"
        label="Alertas"
        active={active === 'Alerts'}
        onPress={() => onNavigate('Alerts')}
      />

      <TabItem
        icon="◔"
        label="Perfil"
        active={active === 'Profile'}
        onPress={() => onNavigate('Profile')}
      />

    </View>
  );
}

const styles = StyleSheet.create({

container:{

position:'absolute',

bottom:0,

left:0,

right:0,

flexDirection:'row',

justifyContent:'space-around',

alignItems:'flex-end',

paddingTop:12,

paddingBottom:18,

backgroundColor:'#FFF',

borderTopLeftRadius:24,

borderTopRightRadius:24,

shadowColor:'#8EA0C3',

shadowOpacity:.16,

shadowOffset:{
width:0,
height:-8
},

shadowRadius:18,

elevation:10

},

tab:{

alignItems:'center',

justifyContent:'center',

minWidth:60

},

icon:{

fontSize:20,

fontWeight:'800',

color:'#A0AEC2'

},

iconActive:{

color:'#2F6CF0'

},

label:{

marginTop:5,

fontSize:11,

fontWeight:'700',

color:'#A0AEC2'

},

labelActive:{

color:'#2F6CF0'

},

fabContainer:{

marginTop:-28

},

fab:{

width:56,

height:56,

borderRadius:28,

backgroundColor:'#2F6CF0',

justifyContent:'center',

alignItems:'center',

shadowColor:'#2F6CF0',

shadowOpacity:.28,

shadowOffset:{
width:0,
height:10
},

shadowRadius:15,

elevation:8

},

fabIcon:{

fontSize:30,

color:'#FFF',

marginTop:-2

}

});
