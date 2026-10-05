import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>NOVA & CO</Text>

        <Text style={styles.title}>
          Affordable luxury, your way.
        </Text>

        <Text style={styles.subtitle}>
          Discover bags, jewellery, dresses and more.
        </Text>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>SHOP NOW</Text>
        </Pressable>

        <Pressable
          style={styles.accountButton}
          onPress={() => router.push('/auth')}
        >
          <Text style={styles.accountButtonText}>ACCOUNT / LOG IN</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    backgroundColor: '#111111',
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  accountButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 8,
  },
  accountButtonText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
});

