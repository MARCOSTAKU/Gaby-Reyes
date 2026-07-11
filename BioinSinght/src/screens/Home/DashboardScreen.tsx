import { Pressable, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import QuickAction from '../../components/dashboard/QuickAction';
import ResultCard from '../../components/dashboard/ResultCard';
import { results } from '../../data/results';
import styles from '../../styles/dashboard.styles';
import type { BottomTabParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<BottomTabParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#2760E8" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroKicker}>BUENOS DÍAS</Text>
              <Text style={styles.heroName}>Ana García</Text>
            </View>
            <Pressable style={styles.notificationButton} onPress={() => navigation.navigate('Alerts')}>
              <Text style={styles.notificationIcon}>!</Text>
              <View style={styles.notificationDot} />
            </Pressable>
          </View>
          <View style={styles.statusCard}>
            <View style={styles.statusIconContainer}><Text style={styles.statusIcon}>!</Text></View>
            <View>
              <Text style={styles.statusLabel}>Estado general</Text>
              <Text style={styles.statusTitle}>Requiere atención</Text>
              <Text style={styles.statusSubtitle}>1 resultado fuera del rango normal</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <QuickAction icon="+" label="Registrar" onPress={() => navigation.getParent()?.navigate('Onboarding')} />
          <QuickAction icon="H" label="Historial" onPress={() => navigation.navigate('History')} />
          <QuickAction icon="E" label="Evolución" onPress={() => navigation.navigate('Evolution')} />
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos resultados</Text>
          <Pressable onPress={() => navigation.navigate('History')}><Text style={styles.sectionLink}>Ver todo</Text></Pressable>
        </View>
        <View style={styles.results}>{results.map((item) => <ResultCard key={item.id} item={item} />)}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
