import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { usePreferences } from '../../context/PreferencesContext';
import type { BottomTabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<BottomTabParamList, 'Profile'>;
const interestLabels: Record<string, string> = { diabetes: 'Diabetes', cardio: 'Salud cardiovascular', renal: 'Función renal', general: 'Salud general' };

export default function ProfileScreen({ navigation }: Props) {
  const { selectedInterests } = usePreferences();
  const interests = selectedInterests.map((interest) => interestLabels[interest]).filter(Boolean).join(' · ') || 'Sin intereses seleccionados';

  return <SafeAreaView style={s.page} edges={['top', 'left', 'right']}><Text style={s.title}>Mi perfil</Text><View style={s.profile}><View style={s.avatar}><Text style={s.avatarText}>AG</Text></View><View><Text style={s.name}>Ana García</Text><Text style={s.email}>ana@ejemplo.com</Text></View></View><View style={s.list}><Row label="Mis intereses" value={interests}/><Row label="Notificaciones" value="Activadas"/><Row label="Privacidad" value="Gestionar datos"/><Pressable style={s.logout} onPress={() => navigation.getParent()?.navigate('Login')}><Text style={s.logoutText}>Cerrar sesión</Text></Pressable></View></SafeAreaView>;
}
function Row({label,value}:{label:string;value:string}){return <View style={s.row}><Text style={s.rowLabel}>{label}</Text><Text style={s.rowValue}>{value}</Text></View>}
const s=StyleSheet.create({page:{flex:1,backgroundColor:'#F5F7FB',padding:20},title:{fontSize:24,fontWeight:'800',color:'#243449'},profile:{marginTop:22,padding:18,backgroundColor:'#FFF',borderRadius:20,flexDirection:'row',alignItems:'center'},avatar:{width:58,height:58,borderRadius:29,backgroundColor:'#DCE8FF',alignItems:'center',justifyContent:'center',marginRight:14},avatarText:{color:'#2F6CF0',fontWeight:'800',fontSize:18},name:{fontSize:18,fontWeight:'800',color:'#2A384C'},email:{marginTop:4,color:'#8290A4'},list:{marginTop:18,backgroundColor:'#FFF',borderRadius:20,overflow:'hidden'},row:{padding:17,borderBottomWidth:1,borderColor:'#EEF1F6'},rowLabel:{fontWeight:'800',color:'#2A384C'},rowValue:{marginTop:5,fontSize:13,color:'#7F8DA5'},logout:{padding:17},logoutText:{color:'#E05252',fontWeight:'800'}});
