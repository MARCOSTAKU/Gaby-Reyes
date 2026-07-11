import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const alerts = [
  { title: 'Glucosa elevada detectada', description: 'Tu glucosa de 126 mg/dL supera el rango normal. Consulta con tu médico.', time: 'Hoy, 14:30', tone: 'critical' },
  { title: 'Colesterol en zona de precaución', description: 'Revisa tu alimentación y programa un control.', time: 'Hace 2 días', tone: 'warning' },
  { title: 'Recordatorio de examen', description: 'Han pasado 30 días desde tu último control.', time: '2 semanas atrás', tone: 'info' },
] as const;
const dotStyles = StyleSheet.create({ critical: { backgroundColor: '#EF5D66' }, warning: { backgroundColor: '#F2B72D' }, info: { backgroundColor: '#7C99E8' } });

export default function AlertsScreen(){return <SafeAreaView style={s.page} edges={['top', 'left', 'right']}><ScrollView contentContainerStyle={s.content}><Text style={s.title}>Alertas de salud</Text><View style={s.hero}><Text style={s.heroTitle}>Resultado crítico detectado</Text><Text style={s.heroText}>Recomendamos consultar con un profesional de salud en los próximos días.</Text></View><Text style={s.label}>HISTORIAL DE ALERTAS</Text>{alerts.map((alert)=><View style={s.card} key={alert.title}><View style={s.body}><Text style={s.cardTitle}>{alert.title}</Text><Text style={s.description}>{alert.description}</Text><Text style={s.time}>{alert.time}</Text></View><View style={[s.dot, dotStyles[alert.tone]]}/></View>)}</ScrollView></SafeAreaView>}
const s=StyleSheet.create({page:{flex:1,backgroundColor:'#F5F7FB'},content:{padding:20,paddingBottom:110},title:{fontSize:24,fontWeight:'800',color:'#243449',marginBottom:18},hero:{padding:18,borderRadius:18,backgroundColor:'#FFF1F1',borderWidth:1,borderColor:'#FFD1D1'},heroTitle:{fontSize:16,fontWeight:'800',color:'#C84545'},heroText:{marginTop:7,lineHeight:19,color:'#A14B4B'},label:{marginVertical:20,color:'#8B97A9',fontSize:12,fontWeight:'800',letterSpacing:.7},card:{backgroundColor:'#FFF',borderRadius:16,padding:15,marginBottom:12,flexDirection:'row'},dot:{width:10,height:10,borderRadius:5,marginTop:5,marginLeft:12},body:{flex:1},cardTitle:{fontSize:15,fontWeight:'800',color:'#2A384C'},description:{marginTop:6,lineHeight:18,color:'#68778D'},time:{marginTop:8,color:'#96A1B2',fontSize:12,fontWeight:'700'}});
