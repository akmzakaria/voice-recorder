import { 
  useAudioRecorder, 
  useAudioRecorderState, 
  RecordingPresets, 
  useAudioPlayer,
  requestRecordingPermissionsAsync,
  setAudioModeAsync
} from 'expo-audio';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Recording = {
  id: string;
  uri: string;
  duration: number;
  date: Date;
};

export default function VoiceRecorderScreen() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const player = useAudioPlayer();

  useEffect(() => {
    async function setupAudio() {
      try {
        // Configure audio mode
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });

        // Request permissions
        const { granted } = await requestRecordingPermissionsAsync();
        setHasPermission(granted);
        
        if (!granted) {
          Alert.alert(
            'Permission Required',
            'Microphone permission is required to record audio.'
          );
        }
      } catch (err) {
        console.error('Failed to setup audio', err);
      }
    }

    setupAudio();
  }, []);

  async function startRecording() {
    if (!hasPermission) {
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        Alert.alert(
          'Permission Required',
          'Please grant microphone permission to record audio.'
        );
        return;
      }
      setHasPermission(true);
    }

    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  }

  async function stopRecording() {
    try {
      await recorder.stop();
      
      const uri = recorder.uri;
      if (uri) {
        const newRecording: Recording = {
          id: Date.now().toString(),
          uri,
          duration: recorderState.durationMillis,
          date: new Date(),
        };

        setRecordings((prev) => [newRecording, ...prev]);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Error', 'Failed to stop recording');
    }
  }

  async function playRecording(item: Recording) {
    try {
      if (playingId === item.id) {
        player.pause();
        setPlayingId(null);
        return;
      }

      player.replace({ uri: item.uri });
      player.play();
      setPlayingId(item.id);
    } catch (err) {
      console.error('Failed to play recording', err);
      Alert.alert('Error', 'Failed to play recording');
      setPlayingId(null);
    }
  }

  function deleteRecording(id: string) {
    Alert.alert(
      'Delete Recording',
      'Are you sure you want to delete this recording?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (playingId === id) {
              player.pause();
              setPlayingId(null);
            }
            setRecordings((prev) => prev.filter((rec) => rec.id !== id));
          },
        },
      ]
    );
  }

  function formatDuration(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice Recorder</Text>
      </View>

      <View style={styles.recordingSection}>
        {recorderState.isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>Recording...</Text>
          </View>
        )}

        <Text style={styles.duration}>
          {formatDuration(recorderState.durationMillis)}
        </Text>

        <TouchableOpacity
          style={[styles.recordButton, recorderState.isRecording && styles.recordButtonActive]}
          onPress={recorderState.isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.buttonText}>
            {recorderState.isRecording ? '■' : '🎤'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.listTitle}>
          Recordings ({recordings.length})
        </Text>

        <FlatList
          data={recordings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.recordingItem}>
              <TouchableOpacity
                style={styles.recordingInfo}
                onPress={() => playRecording(item)}
              >
                <View style={styles.playButton}>
                  <Text style={styles.playIcon}>
                    {playingId === item.id ? '⏸' : '▶'}
                  </Text>
                </View>

                <View style={styles.recordingDetails}>
                  <Text style={styles.recordingDate}>
                    {item.date.toLocaleDateString()} {item.date.toLocaleTimeString()}
                  </Text>
                  <Text style={styles.recordingDuration}>
                    {formatDuration(item.duration)}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteRecording(item.id)}
              >
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No recordings yet</Text>
              <Text style={styles.emptySubtext}>
                Tap the microphone button to start recording
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#208AEF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  recordingSection: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff0000',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 16,
    color: '#ff0000',
    fontWeight: '600',
  },
  duration: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordButtonActive: {
    backgroundColor: '#ff0000',
  },
  buttonText: {
    fontSize: 32,
    color: '#fff',
  },
  listSection: {
    flex: 1,
    padding: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  recordingItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  recordingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#208AEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  playIcon: {
    fontSize: 20,
    color: '#fff',
  },
  recordingDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  recordingDate: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  recordingDuration: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
});
