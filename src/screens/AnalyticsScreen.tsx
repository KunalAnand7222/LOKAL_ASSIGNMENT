import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native'
import { getEvents } from '../services/eventLogger'

export default function AnalyticsScreen({ navigation }: any) {

  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    setEvents(getEvents())
  }, [])

  const loginEvents = events.filter(e =>
    e.event === 'otp_validation_success'
  )

  const sessionEvents = events.filter(e =>
    e.event === 'logout'
  )

  return (
    <SafeAreaView style={styles.safe}>
  <View style={styles.wrapper}>
    <View style={styles.card}>
          <Text style={{ fontSize: 22 }}></Text>
        </View>

        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>
          {events.length} total events
        </Text>

        <ScrollView style={{ width: '90%' }}>

          <Text style={styles.sectionTitle}>Login History</Text>
          <View style={styles.tableContainer}>
            {loginEvents.length === 0 ? (
              <Text style={styles.empty}>No login history</Text>
            ) : (
              loginEvents.map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.event}>{item.email}</Text>
                  <Text style={styles.text}>{item.time}</Text>
                </View>
              ))
            )}
          </View>

          <Text style={styles.sectionTitle}>Session History</Text>
          <View style={styles.tableContainer}>
            {sessionEvents.length === 0 ? (
              <Text style={styles.empty}>No session history</Text>
            ) : (
              sessionEvents.map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.event}>{item.email}</Text>
                  <Text style={styles.text}>{item.time}</Text>
                </View>
              ))
            )}
          </View>

        </ScrollView>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back to session</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f172a'
  },

  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },

  iconCircle: {
    backgroundColor: '#14532d',
    padding: 18,
    borderRadius: 50,
    marginBottom: 20
  },

  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#111827',
    paddingVertical: 35,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1f2937',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 12
  },

  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6
  },

  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 25
  },

  sectionTitle: {
    color: '#22c55e',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },

  tableContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 15,
    padding: 18,
    marginBottom: 25
  },

  row: {
    marginBottom: 12
  },

  event: {
    color: '#22c55e',
    fontWeight: '600'
  },

  text: {
    color: '#94a3b8'
  },

  empty: {
    color: '#64748b',
    textAlign: 'center'
  },

  back: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 10
  }
})


