import { StyleSheet } from 'react-native';

export default StyleSheet.create({

container:{

flex:1,

backgroundColor:'#2760E8'

},

scrollView:{

backgroundColor:'#EEF3FF'

},

scroll:{

paddingBottom:120

},

hero:{

backgroundColor:'#2760E8',

paddingHorizontal:20,

paddingTop:18,

paddingBottom:22,

borderBottomLeftRadius:28,

borderBottomRightRadius:28

},

heroTop:{

flexDirection:'row',

justifyContent:'space-between',

alignItems:'flex-start',

marginBottom:18

},

heroKicker:{

fontSize:12,

fontWeight:'700',

letterSpacing:.5,

color:'rgba(255,255,255,.75)'

},

heroName:{

fontSize:24,

fontWeight:'800',

marginTop:3,

color:'#FFF'

},

notificationButton:{

width:42,

height:42,

borderRadius:21,

backgroundColor:'rgba(255,255,255,.15)',

justifyContent:'center',

alignItems:'center'

},

notificationIcon:{

fontSize:18

},

notificationDot:{

position:'absolute',

top:9,

right:10,

width:8,

height:8,

borderRadius:4,

backgroundColor:'#FF6666',

borderWidth:1,

borderColor:'#2760E8'

},

statusCard:{

backgroundColor:'rgba(255,255,255,.15)',

borderRadius:18,

padding:14,

flexDirection:'row',

alignItems:'center'

},

statusIconContainer:{

width:50,

height:50,

borderRadius:25,

backgroundColor:'#FFE8E8',

justifyContent:'center',

alignItems:'center',

marginRight:12

},

statusIcon:{

fontSize:28,

fontWeight:'800',

color:'#EF6A6A'

},

statusLabel:{

fontSize:12,

fontWeight:'700',

color:'rgba(255,255,255,.75)'

},

statusTitle:{

marginTop:2,

fontSize:18,

fontWeight:'800',

color:'#FFF'

},

statusSubtitle:{

marginTop:2,

fontSize:12,

color:'rgba(255,255,255,.85)'

},

quickActions:{

flexDirection:'row',

paddingHorizontal:20,

marginTop:18,

gap:12

},

sectionHeader:{

marginTop:22,

marginBottom:12,

paddingHorizontal:20,

flexDirection:'row',

justifyContent:'space-between',

alignItems:'center'

},

sectionTitle:{

fontSize:18,

fontWeight:'800',

color:'#223046'

},

sectionLink:{

fontSize:13,

fontWeight:'700',

color:'#5A78D8'

},

results:{

paddingHorizontal:20

}

});
