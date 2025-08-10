import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import {HistoryService, HistoryItem} from '../services/historyService';
import HistoryItemCard from '../components/HistoryItemCard';
import SearchHistory from '../components/SearchHistory';

const GREEN = '#2E7D32';

export default function HistoryScreen(): React.JSX.Element {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load lịch sử thực tế từ HistoryService
  useEffect(() => {
    loadHistory();
    loadStats();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await HistoryService.getHistory();
      setHistory(historyData);
      setFilteredHistory(historyData);
    } catch (error) {
      console.error('Lỗi khi load lịch sử:', error);
      Alert.alert('Lỗi', 'Không thể tải lịch sử');
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter(item =>
        item.foodName.toLowerCase().includes(query.toLowerCase()) ||
        item.recommendation.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredHistory(history);
  };

  const loadStats = async () => {
    try {
      const statsData = await HistoryService.getHistoryStats();
      setStats(statsData);
    } catch (error) {
      console.error('Lỗi khi load thống kê:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadHistory(), loadStats()]);
    setRefreshing(false);
  };

  const clearHistory = async () => {
    Alert.alert('Xác nhận', 'Bạn có muốn xóa toàn bộ lịch sử không?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await HistoryService.clearHistory();
            setHistory([]);
            setFilteredHistory([]);
            setStats(null);
            Alert.alert('Thành công', 'Đã xóa toàn bộ lịch sử');
          } catch (error) {
            Alert.alert('Lỗi', 'Không thể xóa lịch sử');
          }
        },
      },
    ]);
  };

  const renderHistoryItem = (item: HistoryItem) => (
    <HistoryItemCard
      key={item.id}
      item={item}
      isExpanded={selectedItem?.id === item.id}
      onToggle={() =>
        setSelectedItem(selectedItem?.id === item.id ? null : item)
      }
      onDelete={async () => {
        try {
          await HistoryService.deleteHistoryItem(item.id);
          await loadHistory();
          await loadStats();
          setSelectedItem(null);
          Alert.alert('Thành công', 'Đã xóa item khỏi lịch sử');
        } catch (error) {
          Alert.alert('Lỗi', 'Không thể xóa item');
        }
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 Lịch sử quét món ăn</Text>
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <Text style={styles.clearButtonText}>Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tìm kiếm */}
      <SearchHistory onSearch={handleSearch} onClear={handleClearSearch} />

      {/* Thống kê */}
      {stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>📊 Thống kê</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalScans}</Text>
              <Text style={styles.statLabel}>Lần quét</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalCalories}</Text>
              <Text style={styles.statLabel}>Tổng calo</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.averageHealthScore}</Text>
              <Text style={styles.statLabel}>Điểm TB</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.mostScannedFood}</Text>
              <Text style={styles.statLabel}>Món yêu thích</Text>
            </View>
          </View>
        </View>
      )}

      {filteredHistory.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📸</Text>
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có lịch sử'}
          </Text>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'Thử tìm kiếm với từ khóa khác'
              : 'Sử dụng tab Scan để chụp ảnh món ăn và xem lịch sử ở đây'}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.historyList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {filteredHistory.map(renderHistoryItem)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  historyList: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: GREEN,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  historyDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  expandedDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GREEN,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
