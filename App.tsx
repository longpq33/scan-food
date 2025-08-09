/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import HistoryScreen from './src/screens/HistoryScreen';

type TabKey = 'home' | 'scan' | 'history';

const GREEN = '#2E7D32';
const GREEN_LIGHT = '#388E3C';

function App(): React.JSX.Element {
  const [tab, setTab] = useState<TabKey>('scan');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <StatusBar barStyle={'light-content'} backgroundColor={GREEN} />

      <View style={{flex: 1}}>
        {tab === 'home' && <HomeScreen />}
        {tab === 'scan' && <ScanScreen />}
        {tab === 'history' && <HistoryScreen />}
      </View>

      <View style={[styles.tabBar, {backgroundColor: GREEN}]}>
        <TouchableOpacity style={[styles.tabBtn, tab === 'home' && {backgroundColor: GREEN_LIGHT}]} onPress={() => setTab('home')}>
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'scan' && {backgroundColor: GREEN_LIGHT}]} onPress={() => setTab('scan')}>
          <Text style={styles.tabText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'history' && {backgroundColor: GREEN_LIGHT}]} onPress={() => setTab('history')}>
          <Text style={styles.tabText}>History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#1B5E20' },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabText: { fontWeight: '600', color: '#FFFFFF' },
});

export default App;
