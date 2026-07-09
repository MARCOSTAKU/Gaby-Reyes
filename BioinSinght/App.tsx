import { useMemo, useRef, useState } from 'react';
import {
  PanResponder,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Screen = 'onboarding' | 'login' | 'dashboard' | 'history' | 'alerts' | 'evolution';

type ResultItem = {
  name: string;
  date: string;
  value: string;
  unit: string;
  badge: string;
  tone: 'danger' | 'warning' | 'success';
  icon: string;
};

type HistoryItem = ResultItem & {
  category: 'Diabetes' | 'Cardiovascular' | 'Renal' | 'Todos';
};

type AlertItem = {
  title: string;
  description: string;
  time: string;
  tone: 'critical' | 'warning' | 'info';
};

type EvolutionPoint = {
  month: string;
  value: number;
};

type InterestOption = {
  key: string;
  title: string;
  subtitle: string;
  icon: string;
};

const results: ResultItem[] = [
  {
    name: 'Glucosa en Ayunas',
    date: '15 Jun 2024',
    value: '126',
    unit: 'mg/dL',
    badge: 'Atención',
    tone: 'danger',
    icon: '∿',
  },
  {
    name: 'Colesterol Total',
    date: '10 Jun 2024',
    value: '215',
    unit: 'mg/dL',
    badge: 'Precaución',
    tone: 'warning',
    icon: '◌',
  },
  {
    name: 'Hemoglobina A1C',
    date: '28 May 2024',
    value: '5.4',
    unit: '%',
    badge: 'Normal',
    tone: 'success',
    icon: '∿',
  },
];

const historyResults: HistoryItem[] = [
  {
    name: 'Glucosa en Ayunas',
    date: '15 Jun 2024',
    value: '126',
    unit: 'mg/dL',
    badge: 'Atención',
    tone: 'danger',
    icon: '∿',
    category: 'Diabetes',
  },
  {
    name: 'Colesterol Total',
    date: '10 Jun 2024',
    value: '215',
    unit: 'mg/dL',
    badge: 'Precaución',
    tone: 'warning',
    icon: '∿',
    category: 'Cardiovascular',
  },
  {
    name: 'Hemoglobina A1C',
    date: '28 May 2024',
    value: '5.4',
    unit: '%',
    badge: 'Normal',
    tone: 'success',
    icon: '∿',
    category: 'Diabetes',
  },
  {
    name: 'Creatinina',
    date: '20 May 2024',
    value: '0.9',
    unit: 'mg/dL',
    badge: 'Normal',
    tone: 'success',
    icon: '∿',
    category: 'Renal',
  },
  {
    name: 'Triglicéridos',
    date: '15 May 2024',
    value: '185',
    unit: 'mg/dL',
    badge: 'Precaución',
    tone: 'warning',
    icon: '∿',
    category: 'Cardiovascular',
  },
  {
    name: 'Glucosa en Ayunas',
    date: '20 Abr 2024',
    value: '118',
    unit: 'mg/dL',
    badge: 'Precaución',
    tone: 'warning',
    icon: '∿',
    category: 'Diabetes',
  },
];

const historyTabs = ['Todos', 'Diabetes', 'Cardiovascular', 'Renal'] as const;

const alerts: AlertItem[] = [
  {
    title: 'Glucosa elevada detectada',
    description: 'Tu glucosa de 126 mg/dL supera el rango normal. Consulta con tu médico.',
    time: 'Hoy, 14:30',
    tone: 'critical',
  },
  {
    title: 'Colesterol en zona de precaución',
    description: 'Colesterol 215 mg/dL. Te recomendamos revisar tu alimentación.',
    time: 'Hace 2 días',
    tone: 'warning',
  },
  {
    title: 'Triglicéridos ligeramente altos',
    description: '185 mg/dL supera el límite recomendado de 150 mg/dL.',
    time: '9 días atrás',
    tone: 'warning',
  },
  {
    title: 'Recordatorio de examen',
    description: 'Han pasado 30 días desde tu último control. Programa un seguimiento.',
    time: '2 semanas atrás',
    tone: 'info',
  },
];

const evolutionPoints: EvolutionPoint[] = [
  { month: 'Ene', value: 95 },
  { month: 'Feb', value: 101 },
  { month: 'Mar', value: 106 },
  { month: 'Abr', value: 118 },
  { month: 'May', value: 115 },
  { month: 'Jun', value: 126 },
];

const interestOptions: InterestOption[] = [
  {
    key: 'diabetes',
    title: 'Diabetes',
    subtitle: 'Glucosa, HbA1C, insulina',
    icon: '∿',
  },
  {
    key: 'cardio',
    title: 'Salud Cardiovascular',
    subtitle: 'Colesterol, triglicéridos, PA',
    icon: '♡',
  },
  {
    key: 'renal',
    title: 'Función Renal',
    subtitle: 'Creatinina, urea, filtrado',
    icon: '◌',
  },
  {
    key: 'general',
    title: 'Salud General',
    subtitle: 'Hemograma, vitaminas, minerales',
    icon: '☆',
  },
];

function buildChartPoints(values: EvolutionPoint[], width: number, height: number) {
  const leftPadding = 20;
  const rightPadding = 10;
  const topPadding = 16;
  const bottomPadding = 24;
  const minValue = 60;
  const maxValue = 140;
  const plotWidth = width - leftPadding - rightPadding;
  const plotHeight = height - topPadding - bottomPadding;

  return values.map((point, index) => {
    const xStep = plotWidth / (values.length - 1);
    const x = leftPadding + index * xStep;
    const normalized = (point.value - minValue) / (maxValue - minValue);
    const y = height - bottomPadding - normalized * plotHeight;
    return { ...point, x, y };
  });
}

function buildSmoothCurve(points: Array<{ x: number; y: number }>, samplesPerSegment = 12) {
  if (points.length < 2) {
    return points;
  }

  const curve: Array<{ x: number; y: number }> = [];

  const interpolate = (
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    t: number,
  ) => {
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      x:
        0.5 *
        ((2 * p1.x) +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
      y:
        0.5 *
        ((2 * p1.y) +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
    };
  };

  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? points[index + 1];

    for (let sample = 0; sample < samplesPerSegment; sample += 1) {
      const t = sample / samplesPerSegment;
      curve.push(interpolate(p0, p1, p2, p3, t));
    }
  }

  curve.push(points[points.length - 1]);
  return curve;
}

function App() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [email, setEmail] = useState('tu@email.com');
  const [password, setPassword] = useState('••••••••');
  const [historyFilter, setHistoryFilter] = useState<(typeof historyTabs)[number]>('Todos');
  const [historySearch, setHistorySearch] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['diabetes', 'cardio']);

  const navigationMap = useMemo<Record<Screen, { left: Screen | null; right: Screen | null }>>(
    () => ({
      onboarding: { left: 'login', right: null },
      login: { left: 'dashboard', right: 'onboarding' },
      dashboard: { left: 'history', right: 'login' },
      history: { left: 'alerts', right: 'dashboard' },
      alerts: { left: 'evolution', right: 'history' },
      evolution: { left: null, right: 'alerts' },
    }),
    [],
  );

  const screenRef = useRef<Screen>(screen);
  screenRef.current = screen;

  const navigateRelative = (direction: 'left' | 'right') => {
    const target = navigationMap[screenRef.current][direction];
    if (target) {
      setScreen(target);
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
          return isHorizontal && Math.abs(gestureState.dx) > 20;
        },
        onPanResponderRelease: (_, gestureState) => {
          if (Math.abs(gestureState.dx) < 70 || Math.abs(gestureState.dx) < Math.abs(gestureState.dy)) {
            return;
          }

          if (gestureState.dx < 0) {
            navigateRelative('left');
          } else {
            navigateRelative('right');
          }
        },
      }),
    [],
  );

  const filteredHistory = historyResults.filter((item) => {
    const matchesCategory = historyFilter === 'Todos' || item.category === historyFilter;
    const matchesSearch =
      historySearch.trim().length === 0 ||
      `${item.name} ${item.date} ${item.value} ${item.unit}`.toLowerCase().includes(historySearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (screen === 'onboarding') {
    return (
      <SafeAreaView style={styles.safeAreaOnboarding} {...panResponder.panHandlers}>
        <StatusBar barStyle="dark-content" />

        <ScrollView contentContainerStyle={styles.onboardingContent} showsVerticalScrollIndicator={false}>
          <View style={styles.onboardingTopRow}>
            <Pressable style={styles.backButton} onPress={() => setScreen('dashboard')}>
              <Text style={styles.backButtonIcon}>←</Text>
            </Pressable>
          </View>

          <View style={styles.onboardingBrandWrap}>
            <View style={styles.onboardingBrandIcon}>
              <Text style={styles.onboardingBrandIconText}>∿</Text>
            </View>
          </View>

          <View style={styles.onboardingHeader}>
            <Text style={styles.onboardingTitle}>¿Qué deseas monitorear?</Text>
            <Text style={styles.onboardingSubtitle}>Selecciona uno o más intereses de salud</Text>
          </View>

          <View style={styles.onboardingList}>
            {interestOptions.map((option) => {
              const selected = selectedInterests.includes(option.key);

              return (
                <Pressable
                  key={option.key}
                  style={[styles.onboardingCard, selected && styles.onboardingCardSelected]}
                  onPress={() => {
                    setSelectedInterests((current) =>
                      current.includes(option.key)
                        ? current.filter((value) => value !== option.key)
                        : [...current, option.key],
                    );
                  }}
                >
                  <View style={[styles.onboardingCardIcon, selected && styles.onboardingCardIconSelected]}>
                    <Text style={[styles.onboardingCardIconText, selected && styles.onboardingCardIconTextSelected]}>
                      {option.icon}
                    </Text>
                  </View>

                  <View style={styles.onboardingCardBody}>
                    <Text style={styles.onboardingCardTitle}>{option.title}</Text>
                    <Text style={styles.onboardingCardSubtitle}>{option.subtitle}</Text>
                  </View>

                  <View style={[styles.onboardingCheck, selected && styles.onboardingCheckSelected]}>
                    {selected ? <Text style={styles.onboardingCheckText}>✓</Text> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.onboardingFooter}>
          <Pressable
            style={[styles.onboardingButton, selectedInterests.length === 0 && styles.onboardingButtonDisabled]}
            onPress={() => setScreen('login')}
          >
            <Text style={styles.onboardingButtonText}>Comenzar con BioNexus</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'history') {
    return (
      <SafeAreaView style={styles.safeAreaHistory} {...panResponder.panHandlers}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.historyHeader}>
          <Pressable style={styles.backButton} onPress={() => setScreen('dashboard')}>
            <Text style={styles.backButtonIcon}>←</Text>
          </Pressable>
          <Text style={styles.historyTitle}>Historial Clínico</Text>
        </View>

        <View style={styles.historySearchWrap}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.historySearchInput}
            value={historySearch}
            onChangeText={setHistorySearch}
            placeholder="Buscar examen..."
            placeholderTextColor="#a8b3c4"
          />
        </View>

        <ScrollView contentContainerStyle={styles.historyContent} showsVerticalScrollIndicator={false}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.historyTabsRow}>
            {historyTabs.map((tab) => {
              const active = historyFilter === tab;
              return (
                <Pressable
                  key={tab}
                  style={[styles.historyTab, active && styles.historyTabActive]}
                  onPress={() => setHistoryFilter(tab)}
                >
                  <Text style={[styles.historyTabLabel, active && styles.historyTabLabelActive]}>{tab}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.historyList}>
            {filteredHistory.map((item) => (
              <View key={`${item.name}-${item.date}`} style={styles.historyCard}>
                <View style={[styles.historyIconWrap, toneStyles[item.tone].iconWrap]}>
                  <Text style={[styles.historyIcon, toneStyles[item.tone].icon]}>{item.icon}</Text>
                </View>

                <View style={styles.historyMain}>
                  <Text style={styles.historyName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.historyDate}>📅 {item.date}</Text>
                </View>

                <View style={styles.historyValueBlock}>
                  <Text style={styles.historyValue}>
                    {item.value} <Text style={styles.historyUnit}>{item.unit}</Text>
                  </Text>
                  <View style={[styles.badge, toneStyles[item.tone].badge]}>
                    <Text style={[styles.badgeText, toneStyles[item.tone].badgeText]}>{item.badge}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TabItem icon="⌂" label="Inicio" onPress={() => setScreen('dashboard')} />
          <TabItem icon="▤" label="Historial" active onPress={() => setScreen('history')} />
          <View style={styles.fabWrap}>
            <Pressable style={styles.fab} onPress={() => setScreen('onboarding')}>
              <Text style={styles.fabIcon}>＋</Text>
            </Pressable>
          </View>
          <TabItem icon="◌" label="Alertas" onPress={() => setScreen('alerts')} />
          <TabItem icon="◔" label="Perfil" onPress={() => setScreen('dashboard')} />
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'alerts') {
    return (
      <SafeAreaView style={styles.safeAreaAlerts} {...panResponder.panHandlers}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.simpleHeader}>
          <Pressable style={styles.backButton} onPress={() => setScreen('dashboard')}>
            <Text style={styles.backButtonIcon}>←</Text>
          </Pressable>
          <Text style={styles.simpleHeaderTitle}>Alertas de Salud</Text>
        </View>

        <ScrollView contentContainerStyle={styles.alertsContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.alertHero, alertToneStyles.critical.card]}>
            <View style={[styles.alertHeroIcon, alertToneStyles.critical.iconWrap]}>
              <Text style={[styles.alertHeroIconText, alertToneStyles.critical.iconText]}>⚠</Text>
            </View>
            <View style={styles.alertHeroTextWrap}>
              <Text style={[styles.alertHeroTitle, alertToneStyles.critical.title]}>Resultado crítico detectado</Text>
              <Text style={[styles.alertHeroSubtitle, alertToneStyles.critical.subtitle]}>
                Se recomienda consultar con un profesional de salud en los próximos días para evaluar tu glucosa
              </Text>
            </View>
          </View>

          <Text style={styles.sectionHeaderSmall}>HISTORIAL DE ALERTAS</Text>

          <View style={styles.alertList}>
            {alerts.map((alert) => (
              <View key={alert.title} style={[styles.alertCard, alertToneStyles[alert.tone].card]}>
                <View style={[styles.alertCardIconWrap, alertToneStyles[alert.tone].iconWrap]}>
                  <Text style={[styles.alertCardIcon, alertToneStyles[alert.tone].iconText]}>
                    {alert.tone === 'critical' ? '⚠' : alert.tone === 'warning' ? '◔' : '⌁'}
                  </Text>
                </View>

                <View style={styles.alertCardMain}>
                  <Text style={[styles.alertCardTitle, alertToneStyles[alert.tone].title]}>{alert.title}</Text>
                  <Text style={[styles.alertCardDescription, alertToneStyles[alert.tone].subtitle]}>{alert.description}</Text>
                  <Text style={styles.alertCardTime}>{alert.time}</Text>
                </View>

                <View style={[styles.alertDot, alertToneStyles[alert.tone].dot]} />
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TabItem icon="⌂" label="Inicio" onPress={() => setScreen('dashboard')} />
          <TabItem icon="▤" label="Historial" onPress={() => setScreen('history')} />
          <View style={styles.fabWrap}>
            <Pressable style={styles.fab} onPress={() => setScreen('onboarding')}>
              <Text style={styles.fabIcon}>＋</Text>
            </Pressable>
          </View>
          <TabItem icon="◌" label="Alertas" active onPress={() => setScreen('alerts')} />
          <TabItem icon="◔" label="Perfil" onPress={() => setScreen('dashboard')} />
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'evolution') {
    const chartWidth = 280;
    const chartHeight = 220;
    const chartPoints = buildChartPoints(evolutionPoints, chartWidth, chartHeight);
    const smoothCurve = buildSmoothCurve(chartPoints, 12);

    return (
      <SafeAreaView style={styles.safeAreaEvolution} {...panResponder.panHandlers}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.simpleHeader}>
          <Pressable style={styles.backButton} onPress={() => setScreen('dashboard')}>
            <Text style={styles.backButtonIcon}>←</Text>
          </Pressable>
          <Text style={styles.simpleHeaderTitle}>Evolución del Examen</Text>
        </View>

        <ScrollView contentContainerStyle={styles.evolutionContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.evolutionSubtitle}>Glucosa en Ayunas — últimos 6 meses</Text>

          <View style={styles.evolutionCard}>
            <View style={styles.evolutionTopRow}>
              <View>
                <Text style={styles.evolutionLabel}>Valor actual</Text>
                <Text style={styles.evolutionCurrentValue}>126 mg/dL</Text>
              </View>
              <View style={styles.evolutionTrendWrap}>
                <Text style={styles.evolutionLabel}>Tendencia</Text>
                <Text style={styles.evolutionTrendValue}>↗ +7.7% vs. anterior</Text>
              </View>
            </View>

            <View style={styles.chartWrap}>
              <View style={styles.chartYAxis}>
                <Text style={styles.chartAxisLabel}>140</Text>
                <Text style={styles.chartAxisLabel}>120</Text>
                <Text style={styles.chartAxisLabel}>100</Text>
                <Text style={styles.chartAxisLabel}>80</Text>
                <Text style={styles.chartAxisLabel}>60</Text>
              </View>

              <View style={styles.chartArea}>
                <View style={[styles.chartGuideLine, { top: 18 }]} />
                <View style={[styles.chartGuideLine, { top: 68 }]} />
                <View style={[styles.chartGuideLine, { top: 118 }]} />
                <View style={[styles.chartGuideLine, { top: 168 }]} />

                {smoothCurve.map((point, index) => {
                  if (index === smoothCurve.length - 1) {
                    return null;
                  }

                  const nextPoint = smoothCurve[index + 1];
                  const deltaX = nextPoint.x - point.x;
                  const deltaY = nextPoint.y - point.y;
                  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                  const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

                  return (
                    <View
                      key={`${index}-${nextPoint.x.toFixed(2)}-${nextPoint.y.toFixed(2)}`}
                      style={[
                        styles.chartLineGlow,
                        {
                          left: point.x,
                          top: point.y,
                          width: length,
                          transform: [{ rotate: `${angle}deg` }],
                        },
                      ]}
                    />
                  );
                })}

                {smoothCurve.map((point, index) => {
                  if (index === smoothCurve.length - 1) {
                    return null;
                  }

                  const nextPoint = smoothCurve[index + 1];
                  const deltaX = nextPoint.x - point.x;
                  const deltaY = nextPoint.y - point.y;
                  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                  const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

                  return (
                    <View
                      key={`core-${index}-${nextPoint.x.toFixed(2)}-${nextPoint.y.toFixed(2)}`}
                      style={[
                        styles.chartLineCore,
                        {
                          left: point.x,
                          top: point.y,
                          width: length,
                          transform: [{ rotate: `${angle}deg` }],
                        },
                      ]}
                    />
                  );
                })}

                {chartPoints.map((point, index) => (
                  <View
                    key={point.month}
                    style={[
                      styles.chartPoint,
                      { left: point.x - 5, top: point.y - 5 },
                      index === chartPoints.length - 1 && styles.chartPointActive,
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.evolutionLegendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: '#4cc38a' }]} />
                <Text style={styles.legendText}>Mínimo normal (70)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: '#f3b233' }]} />
                <Text style={styles.legendText}>Máximo normal (100)</Text>
              </View>
            </View>

            <View style={styles.evolutionMonthsRow}>
              {evolutionPoints.map((point) => (
                <Text key={point.month} style={styles.evolutionMonth}>
                  {point.month}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.metricsRow}>
            <MetricCard label="Mínimo" value="95" unit="mg/dL" tone="success" />
            <MetricCard label="Promedio" value="110" unit="mg/dL" tone="warning" />
            <MetricCard label="Máximo" value="126" unit="mg/dL" tone="critical" />
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TabItem icon="⌂" label="Inicio" onPress={() => setScreen('dashboard')} />
          <TabItem icon="▤" label="Historial" onPress={() => setScreen('history')} />
          <View style={styles.fabWrap}>
            <Pressable style={styles.fab} onPress={() => setScreen('onboarding')}>
              <Text style={styles.fabIcon}>＋</Text>
            </Pressable>
          </View>
          <TabItem icon="◌" label="Alertas" onPress={() => setScreen('alerts')} />
          <TabItem icon="◔" label="Perfil" onPress={() => setScreen('dashboard')} />
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'dashboard') {
    return (
      <SafeAreaView style={styles.safeAreaDashboard} {...panResponder.panHandlers}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.dashboardContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.heroTopRow}>
              <View>
                <Text style={styles.heroKicker}>BUENOS DÍAS</Text>
                <Text style={styles.heroName}>Ana García 👋</Text>
              </View>

              <View style={styles.notificationButton}>
                <Text style={styles.notificationIcon}>🔔</Text>
                <View style={styles.notificationDot} />
              </View>
            </View>

            <View style={styles.statusCard}>
              <View style={styles.statusIconWrap}>
                <Text style={styles.statusIcon}>!</Text>
              </View>
              <View style={styles.statusTextWrap}>
                <Text style={styles.statusLabel}>Estado general</Text>
                <Text style={styles.statusTitle}>Requiere Atención</Text>
                <Text style={styles.statusSubtitle}>1 resultado fuera de rango normal</Text>
              </View>
            </View>
          </View>

          <View style={styles.quickActions}>
              <QuickAction icon="＋" label="Registrar" onPress={() => setScreen('onboarding')} />
            <QuickAction icon="▣" label="Historial" onPress={() => setScreen('history')} />
            <QuickAction icon="↗" label="Evolución" onPress={() => setScreen('evolution')} />
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Últimos resultados</Text>
            <Text style={styles.sectionLink}>Ver todo</Text>
          </View>

          <View style={styles.resultsList}>
            {results.map((item) => (
              <View key={item.name} style={styles.resultCard}>
                <View style={[styles.resultIconWrap, toneStyles[item.tone].iconWrap]}>
                  <Text style={[styles.resultIcon, toneStyles[item.tone].icon]}>{item.icon}</Text>
                </View>

                <View style={styles.resultMain}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultDate}>{item.date}</Text>
                </View>

                <View style={styles.resultValueWrap}>
                  <Text style={styles.resultValue}>
                    {item.value} <Text style={styles.resultUnit}>{item.unit}</Text>
                  </Text>
                  <View style={[styles.badge, toneStyles[item.tone].badge]}>
                    <Text style={[styles.badgeText, toneStyles[item.tone].badgeText]}>{item.badge}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TabItem icon="⌂" label="Inicio" active onPress={() => setScreen('dashboard')} />
          <TabItem icon="▤" label="Historial" onPress={() => setScreen('history')} />
          <View style={styles.fabWrap}>
            <Pressable style={styles.fab} onPress={() => setScreen('onboarding')}>
              <Text style={styles.fabIcon}>＋</Text>
            </Pressable>
          </View>
          <TabItem icon="◌" label="Alertas" onPress={() => setScreen('alerts')} />
          <TabItem icon="◔" label="Perfil" onPress={() => setScreen('dashboard')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaLogin} {...panResponder.panHandlers}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.loginContent} keyboardShouldPersistTaps="handled">
        <View style={styles.loginTopGlow} />

        <View style={styles.brandRow}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandIconPulse}>∿</Text>
          </View>
          <View>
            <Text style={styles.brandName}>BioNexus</Text>
            <Text style={styles.brandTagline}>Tu salud, interpretada</Text>
          </View>
        </View>

        <View style={styles.loginHero}>
          <Text style={styles.loginTitle}>Bienvenido de vuelta</Text>
          <Text style={styles.loginSubtitle}>Inicia sesión para ver tus resultados</Text>
        </View>

        <View style={styles.formCard}>
          <Field label="Correo electrónico" value={email} onChangeText={setEmail} placeholder="tu@email.com" />
          <Field label="Contraseña" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />

          <Pressable onPress={() => setScreen('dashboard')}>
            <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
          </Pressable>

          <Pressable style={styles.primaryButton} onPress={() => setScreen('dashboard')}>
            <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
          </Pressable>
        </View>

        <Text style={styles.signupText}>
          ¿No tienes cuenta? <Text style={styles.signupLink}>Regístrate</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#b8c0cf"
        secureTextEntry={secureTextEntry}
        style={styles.fieldInput}
      />
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.quickActionCard} onPress={onPress}>
      <View style={styles.quickActionIconWrap}>
        <Text style={styles.quickActionIcon}>{icon}</Text>
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

function TabItem({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.tabItem} onPress={onPress}>
      <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function MetricCard({
  label,
  value,
  unit,
  tone,
}: {
  label: string;
  value: string;
  unit: string;
  tone: 'success' | 'warning' | 'critical';
}) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, evolutionToneStyles[tone].value]}>{value}</Text>
      <Text style={styles.metricUnit}>{unit}</Text>
    </View>
  );
}

const alertToneStyles = {
  critical: {
    card: { backgroundColor: '#fff1f1', borderColor: '#f8cccc' },
    iconWrap: { backgroundColor: '#ffe2e2', borderColor: '#f4b6b6' },
    iconText: { color: '#e96565' },
    title: { color: '#d65757' },
    subtitle: { color: '#d97b7b' },
    dot: { backgroundColor: '#ff5d5d' },
  },
  warning: {
    card: { backgroundColor: '#fff8e7', borderColor: '#f3ddb2' },
    iconWrap: { backgroundColor: '#fff0c8', borderColor: '#f3d08a' },
    iconText: { color: '#d79a1e' },
    title: { color: '#ca8f17' },
    subtitle: { color: '#c8a15c' },
    dot: { backgroundColor: '#f0b93a' },
  },
  info: {
    card: { backgroundColor: '#f3f7ff', borderColor: '#d8e3ff' },
    iconWrap: { backgroundColor: '#e5edff', borderColor: '#c5d3ff' },
    iconText: { color: '#6d88d8' },
    title: { color: '#5f73c7' },
    subtitle: { color: '#7d8bb8' },
    dot: { backgroundColor: '#8ca1e5' },
  },
} as const;

const evolutionToneStyles = {
  success: { value: { color: '#2baf72' } },
  warning: { value: { color: '#d89a19' } },
  critical: { value: { color: '#ef6a6a' } },
} as const;

const toneStyles = {
  danger: {
    iconWrap: { backgroundColor: '#fdecec' },
    icon: { color: '#ef6a6a' },
    badge: { backgroundColor: '#fff2f2', borderColor: '#f5b8b8' },
    badgeText: { color: '#ef6a6a' },
  },
  warning: {
    iconWrap: { backgroundColor: '#fff7e6' },
    icon: { color: '#f3b233' },
    badge: { backgroundColor: '#fff8e8', borderColor: '#f4d48d' },
    badgeText: { color: '#d89a19' },
  },
  success: {
    iconWrap: { backgroundColor: '#eafaf1' },
    icon: { color: '#4cc38a' },
    badge: { backgroundColor: '#ecfbf4', borderColor: '#a6e5c4' },
    badgeText: { color: '#2baf72' },
  },
} as const;

const styles = StyleSheet.create({
  safeAreaLogin: {
    flex: 1,
    backgroundColor: '#f4f7fc',
  },
  safeAreaOnboarding: {
    flex: 1,
    backgroundColor: '#edf3ff',
  },
  safeAreaDashboard: {
    flex: 1,
    backgroundColor: '#eef3ff',
  },
  safeAreaHistory: {
    flex: 1,
    backgroundColor: '#f5f8ff',
  },
  safeAreaAlerts: {
    flex: 1,
    backgroundColor: '#fff9f8',
  },
  safeAreaEvolution: {
    flex: 1,
    backgroundColor: '#eef3ff',
  },
  loginContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
    justifyContent: 'center',
  },
  loginTopGlow: {
    position: 'absolute',
    top: -100,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: '#dfeaff',
    opacity: 0.8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  brandIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#2f6cf0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2f6cf0',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 6,
  },
  brandIconPulse: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  brandName: {
    color: '#193055',
    fontSize: 23,
    fontWeight: '800',
  },
  brandTagline: {
    marginTop: 2,
    color: '#8b97a9',
    fontSize: 13,
    fontWeight: '500',
  },
  loginHero: {
    marginBottom: 18,
  },
  loginTitle: {
    color: '#1d2b45',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  loginSubtitle: {
    marginTop: 6,
    color: '#9aa5b8',
    fontSize: 16,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#7d8ca6',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#edf1f7',
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    color: '#4c5d78',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  fieldInput: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dfe5ee',
    paddingHorizontal: 16,
    color: '#223046',
    backgroundColor: '#fff',
    fontSize: 15,
  },
  forgotPassword: {
    color: '#3c74ea',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 14,
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#2f6cf0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2f6cf0',
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 18,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  signupText: {
    marginTop: 18,
    textAlign: 'center',
    color: '#7d8798',
    fontSize: 14,
    fontWeight: '500',
  },
  signupLink: {
    color: '#3c74ea',
    fontWeight: '800',
  },
  onboardingContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 24,
  },
  onboardingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  onboardingBrandWrap: {
    marginTop: 22,
    marginBottom: 28,
  },
  onboardingBrandIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#2f6cf0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2f6cf0',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 4,
  },
  onboardingBrandIconText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  onboardingHeader: {
    marginBottom: 18,
  },
  onboardingTitle: {
    color: '#243449',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  onboardingSubtitle: {
    marginTop: 8,
    color: '#8b97a9',
    fontSize: 16,
    fontWeight: '500',
  },
  onboardingList: {
    gap: 12,
  },
  onboardingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e9edf5',
    paddingVertical: 16,
    paddingHorizontal: 14,
    shadowColor: '#9fb0cc',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 2,
  },
  onboardingCardSelected: {
    borderColor: '#b9ccff',
    backgroundColor: '#f7faff',
    shadowOpacity: 0.12,
  },
  onboardingCardIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#f4f7fb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  onboardingCardIconSelected: {
    backgroundColor: '#e5eeff',
  },
  onboardingCardIconText: {
    color: '#7b8797',
    fontSize: 18,
    fontWeight: '800',
  },
  onboardingCardIconTextSelected: {
    color: '#2f6cf0',
  },
  onboardingCardBody: {
    flex: 1,
    paddingRight: 10,
  },
  onboardingCardTitle: {
    color: '#314257',
    fontSize: 15,
    fontWeight: '800',
  },
  onboardingCardSubtitle: {
    marginTop: 4,
    color: '#8d98a9',
    fontSize: 12,
    fontWeight: '600',
  },
  onboardingCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#d5dceb',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  onboardingCheckSelected: {
    backgroundColor: '#2f6cf0',
    borderColor: '#2f6cf0',
  },
  onboardingCheckText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    marginTop: -1,
  },
  onboardingFooter: {
    paddingTop: 18,
    paddingBottom: 8,
  },
  onboardingButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#a8bff7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2f6cf0',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 3,
  },
  onboardingButtonDisabled: {
    opacity: 0.55,
  },
  onboardingButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  dashboardContent: {
    paddingBottom: 120,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
    gap: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eef2f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonIcon: {
    color: '#8795ab',
    fontSize: 20,
    fontWeight: '700',
    marginTop: -1,
  },
  historyTitle: {
    color: '#243449',
    fontSize: 20,
    fontWeight: '800',
  },
  historySearchWrap: {
    marginHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e4eaf4',
    backgroundColor: '#fff',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    color: '#8ea0b8',
    fontSize: 16,
    marginRight: 8,
    marginTop: -1,
  },
  historySearchInput: {
    flex: 1,
    color: '#243449',
    fontSize: 14,
    paddingVertical: 0,
  },
  historyContent: {
    paddingBottom: 120,
  },
  historyTabsRow: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 8,
  },
  historyTab: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: '#eef2f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTabActive: {
    backgroundColor: '#2f6cf0',
  },
  historyTabLabel: {
    color: '#7d8ca1',
    fontSize: 13,
    fontWeight: '700',
  },
  historyTabLabelActive: {
    color: '#fff',
  },
  historyList: {
    paddingHorizontal: 18,
    gap: 10,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e7edf6',
    padding: 12,
    shadowColor: '#b4c1d7',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 2,
  },
  historyIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyIcon: {
    fontSize: 18,
    fontWeight: '800',
  },
  historyMain: {
    flex: 1,
    paddingRight: 8,
  },
  historyName: {
    color: '#2a384c',
    fontSize: 15,
    fontWeight: '800',
  },
  historyDate: {
    marginTop: 4,
    color: '#95a2b5',
    fontSize: 12,
    fontWeight: '600',
  },
  historyValueBlock: {
    alignItems: 'flex-end',
  },
  historyValue: {
    color: '#2a384c',
    fontSize: 16,
    fontWeight: '800',
  },
  historyUnit: {
    color: '#98a5b8',
    fontSize: 12,
    fontWeight: '700',
  },
  simpleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
    gap: 12,
  },
  simpleHeaderTitle: {
    color: '#243449',
    fontSize: 20,
    fontWeight: '800',
  },
  alertsContent: {
    paddingHorizontal: 18,
    paddingBottom: 120,
  },
  alertHero: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertHeroIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertHeroIconText: {
    fontSize: 20,
    fontWeight: '800',
  },
  alertHeroTextWrap: {
    flex: 1,
  },
  alertHeroTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  alertHeroSubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  sectionHeaderSmall: {
    marginTop: 18,
    marginBottom: 12,
    color: '#a1aaba',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  alertList: {
    gap: 12,
  },
  alertCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertCardIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertCardIcon: {
    fontSize: 15,
    fontWeight: '800',
  },
  alertCardMain: {
    flex: 1,
    paddingRight: 8,
  },
  alertCardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  alertCardDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  alertCardTime: {
    marginTop: 8,
    color: '#a0a8b8',
    fontSize: 12,
    fontWeight: '700',
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  evolutionContent: {
    paddingHorizontal: 18,
    paddingBottom: 120,
  },
  evolutionSubtitle: {
    color: '#7f8da5',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 14,
    paddingLeft: 4,
  },
  evolutionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#9fb0cc',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ebeff7',
  },
  evolutionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  evolutionLabel: {
    color: '#92a0b3',
    fontSize: 12,
    fontWeight: '700',
  },
  evolutionCurrentValue: {
    marginTop: 4,
    color: '#ef6a6a',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  evolutionTrendWrap: {
    alignItems: 'flex-end',
  },
  evolutionTrendValue: {
    marginTop: 4,
    color: '#ef6a6a',
    fontSize: 13,
    fontWeight: '800',
  },
  chartWrap: {
    flexDirection: 'row',
    marginTop: 18,
    height: 240,
  },
  chartYAxis: {
    width: 34,
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 26,
  },
  chartAxisLabel: {
    color: '#a8b3c4',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
    marginLeft: 4,
    marginRight: 4,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#edf1f7',
  },
  chartGuideLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#edf1f7',
  },
  chartLineGlow: {
    position: 'absolute',
    height: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(74, 121, 234, 0.12)',
  },
  chartLineCore: {
    position: 'absolute',
    height: 4,
    borderRadius: 4,
    backgroundColor: '#4a79ea',
  },
  chartPoint: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: 11,
    backgroundColor: '#4a79ea',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#4a79ea',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  chartPointActive: {
    width: 13,
    height: 13,
    borderRadius: 13,
    backgroundColor: '#2f6cf0',
  },
  evolutionLegendRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendSwatch: {
    width: 12,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    color: '#7e8da4',
    fontSize: 12,
    fontWeight: '600',
  },
  evolutionMonthsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingLeft: 34,
    paddingRight: 4,
  },
  evolutionMonth: {
    width: 36,
    textAlign: 'center',
    color: '#8ea0b8',
    fontSize: 12,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#9fb0cc',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#edf1f7',
  },
  metricLabel: {
    color: '#93a1b4',
    fontSize: 12,
    fontWeight: '700',
  },
  metricValue: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '800',
  },
  metricUnit: {
    marginTop: 2,
    color: '#a0a9b9',
    fontSize: 11,
    fontWeight: '700',
  },
  hero: {
    backgroundColor: '#2760e8',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heroKicker: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  heroName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 18,
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: '#ff6a6a',
    borderWidth: 1.5,
    borderColor: '#2760e8',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    padding: 14,
  },
  statusIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffe8e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusIcon: {
    color: '#f07272',
    fontSize: 28,
    fontWeight: '800',
  },
  statusTextWrap: {
    flex: 1,
  },
  statusLabel: {
    color: 'rgba(255,255,255,0.76)',
    fontSize: 12,
    fontWeight: '700',
  },
  statusTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  statusSubtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 14,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 16,
    shadowColor: '#9fb0cc',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 3,
  },
  quickActionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickActionIcon: {
    color: '#2f6cf0',
    fontSize: 22,
    fontWeight: '800',
  },
  quickActionLabel: {
    color: '#33425c',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 10,
  },
  sectionHeader: {
    color: '#223046',
    fontSize: 17,
    fontWeight: '800',
  },
  sectionLink: {
    color: '#5c78d6',
    fontSize: 13,
    fontWeight: '700',
  },
  resultsList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#9fb0cc',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 3,
  },
  resultIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resultIcon: {
    fontSize: 18,
    fontWeight: '800',
  },
  resultMain: {
    flex: 1,
    paddingRight: 8,
  },
  resultName: {
    color: '#25344b',
    fontSize: 15,
    fontWeight: '800',
  },
  resultDate: {
    color: '#8b97a9',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  resultValueWrap: {
    alignItems: 'flex-end',
  },
  resultValue: {
    color: '#25344b',
    fontSize: 18,
    fontWeight: '800',
  },
  resultUnit: {
    color: '#9aa5b8',
    fontSize: 12,
    fontWeight: '700',
  },
  badge: {
    marginTop: 6,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: 16,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    shadowColor: '#8ea0c3',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: -10 },
    shadowRadius: 18,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
  },
  tabIcon: {
    color: '#a1aec2',
    fontSize: 20,
    fontWeight: '800',
  },
  tabIconActive: {
    color: '#2f6cf0',
  },
  tabLabel: {
    color: '#a1aec2',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: '#2f6cf0',
  },
  fabWrap: {
    marginTop: -22,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2f6cf0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2f6cf0',
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 16,
    elevation: 7,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    marginTop: -2,
  },
});

export default App;
