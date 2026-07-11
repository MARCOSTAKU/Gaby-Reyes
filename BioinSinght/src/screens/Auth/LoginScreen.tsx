import { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Image
              source={require('../../../assets/BioinSight.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View>
            <Text style={styles.brandName}>BioinSight</Text>
            <Text style={styles.tagline}>Tu salud, interpretada</Text>
          </View>
        </View>

        <Text style={styles.title}>Bienvenido de vuelta</Text>
        <Text style={styles.subtitle}>
          Inicia sesión para ver tus resultados
        </Text>

        <Card>
          <Input
            label="Correo electrónico"
            value={email}
            placeholder="correo@ejemplo.com"
            onChangeText={setEmail}
          />

          <Input
            label="Contraseña"
            value={password}
            placeholder="••••••••"
            secureTextEntry
            onChangeText={setPassword}
          />

          <Pressable>
            <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
          </Pressable>

          <Button
            title="Iniciar sesión"
            onPress={() => navigation.replace('Main')}
          />
        </Card>

        <Text style={styles.signup}>
          ¿No tienes cuenta? <Text style={styles.link}>Regístrate</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  content: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  brandName: {
    fontSize: 23,
    fontWeight: '800',
    color: '#1D2B45',
  },
  tagline: {
    color: '#8B97A9',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1D2B45',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 16,
    color: '#9AA5B8',
  },
  forgot: {
    marginVertical: 15,
    color: '#2F6CF0',
    fontWeight: '700',
  },
  signup: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
  },
  link: {
    color: '#2F6CF0',
    fontWeight: '800',
  },
});