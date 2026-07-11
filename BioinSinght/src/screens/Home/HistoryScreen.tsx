import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { results } from '../../data/results';
import type { BottomTabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<BottomTabParamList, 'History'>;
const categories = ['Todos', 'Diabetes', 'Cardiovascular'] as const;
const badgeStyles = StyleSheet.create({
  danger: { backgroundColor: '#FFF1F1', borderColor: '#F4C5C5' },
  warning: { backgroundColor: '#FFF8E8', borderColor: '#F1D997' },
  success: { backgroundColor: '#EDFBF4', borderColor: '#B9E4CF' },
});
const badgeTextStyles = StyleSheet.create({
  danger: { color: '#D85A5A' },
  warning: { color: '#C48A16' },
  success: { color: '#2DAD72' },
});

export default function HistoryScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<(typeof categories)[number]>('Todos');
  const [query, setQuery] = useState('');
  const items = useMemo(() => results.filter((item) => (
    (filter === 'Todos' || (filter === 'Diabetes' && item.name.includes('Glucosa')) || (filter === 'Cardiovascular' && item.name.includes('Colesterol')))
    && item.name.toLowerCase().includes(query.toLowerCase())
  )), [filter, query]);

  return <SafeAreaView style={s.page} edges={['top', 'left', 'right']}><View style={s.header}><Text style={s.title}>Historial clínico</Text><Pressable onPress={() => navigation.navigate('Dashboard')}><Text style={s.link}>Inicio</Text></Pressable></View><TextInput style={s.search} value={query} onChangeText={setQuery} placeholder="Buscar examen..." placeholderTextColor="#8B97A9"/><ScrollView contentContainerStyle={s.content}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabs}>{categories.map((category) => <Pressable key={category} style={[s.tab, filter === category && s.tabActive]} onPress={() => setFilter(category)}><Text style={[s.tabText, filter === category && s.tabTextActive]}>{category}</Text></Pressable>)}</ScrollView>{items.map((item) => <View key={item.id} style={s.card}><View><Text style={s.name}>{item.name}</Text><Text style={s.date}>{item.date}</Text></View><View style={s.result}><Text style={s.value}>{item.value} {item.unit}</Text><View style={[s.badge, badgeStyles[item.tone]]}><Text style={[s.badgeText, badgeTextStyles[item.tone]]}>{item.badge}</Text></View></View></View>)}{items.length === 0 && <Text style={s.empty}>No hay resultados que coincidan.</Text>}</ScrollView></SafeAreaView>;
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:'#F5F7FB'},header:{padding:20,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},title:{fontSize:24,fontWeight:'800',color:'#243449'},link:{color:'#2F6CF0',fontWeight:'700'},search:{height:48,marginHorizontal:20,paddingHorizontal:14,backgroundColor:'#FFF',borderRadius:14,borderWidth:1,borderColor:'#E2E8F2',color:'#243449'},content:{paddingBottom:110},tabs:{padding:20,gap:8},tab:{paddingHorizontal:14,paddingVertical:9,borderRadius:18,backgroundColor:'#E9EEF6'},tabActive:{backgroundColor:'#2F6CF0'},tabText:{color:'#65758C',fontWeight:'700'},tabTextActive:{color:'#FFF'},card:{marginHorizontal:20,marginBottom:12,padding:16,borderRadius:16,backgroundColor:'#FFF',flexDirection:'row',justifyContent:'space-between',borderWidth:1,borderColor:'#E7EDF6'},name:{fontSize:15,fontWeight:'800',color:'#2A384C'},date:{marginTop:5,color:'#8B97A9'},result:{alignItems:'flex-end'},value:{fontSize:16,fontWeight:'800',color:'#2A384C'},badge:{marginTop:7,borderWidth:1,borderRadius:16,paddingHorizontal:10,paddingVertical:4},badgeText:{fontWeight:'800',fontSize:12},empty:{textAlign:'center',color:'#8B97A9',marginTop:20}});
