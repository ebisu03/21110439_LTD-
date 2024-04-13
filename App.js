import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const App = () => {
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [lapStartTime, setLapStartTime] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 0.1);
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  const startStop = () => {
    if (!timerRunning) {
      if (laps.length === 0) { // Nếu là lần đầu tiên bắt đầu
        setLapStartTime(time); // Lưu thời gian bắt đầu của lap 1
      }
    }
    setTimerRunning(!timerRunning);
  };

  const lap = () => {
    if (!timerRunning) return;

    if (lapStartTime === null) { // Nếu chưa bắt đầu lap 1
      setLapStartTime(time); // Lưu thời gian bắt đầu của lap 1
      setLaps([time.toFixed(1)]); // Thêm thời gian của lap 1 vào danh sách lap
    } else {
      const lapTime = time - lapStartTime; // Tính thời gian của lap
      setLaps([...laps, lapTime.toFixed(1)]); // Thêm thời gian lap vào danh sách laps
    }
    setTime(0); // Reset thời gian về 0 khi ghi lại một lap và timer không chạy
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setTimerRunning(false);
    setTime(0);
    setLaps([]);
    setLapStartTime(null); // Reset thời gian bắt đầu của lap
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time - Math.floor(time)) * 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).slice(0, 2).padStart(2, '0')}`;
  };

  const findMaxMinLap = () => {
    if (laps.length === 0) return { maxLap: null, minLap: null };

    const filteredLaps = laps.filter((lap, index) => index !== laps.length - 1);
    
    let maxTime = 0;
    let minTime = Infinity;
    let maxLap = null;
    let minLap = null;
    
    for (const lap of filteredLaps) {
      if (lap > maxTime) {
        maxTime = lap;
        maxLap = lap;
      }
      if (lap < minTime) {
        minTime = lap;
        minLap = lap;
      }
    }
    
    return { maxLap, minLap };
  };

  const { maxLap, minLap } = findMaxMinLap();

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={[styles.time, {color: 'white'}]}>{formatTime(time)}</Text>
        <View style={styles.controls}>
          <View style={styles.buttonContainer}>
            {timerRunning ? (
              <TouchableOpacity onPress={lap} style={[styles.button, styles.lapButton]}>
                <Text style={styles.buttonText}>Lap</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={reset} style={[styles.button, styles.resetButton]}>
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={startStop} style={[styles.button, styles.startStopButton, {backgroundColor: timerRunning ? 'red' : 'green'}]}>
              <Text style={styles.buttonText}>{timerRunning ? 'Stop' : 'Start'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.lapsContainer}>
        <FlatList
          data={laps}
          renderItem={({ item, index }) => (
            <View style={[styles.lapItem, 
              item === maxLap ? styles.maxLapItem : 
              item === minLap ? styles.minLapItem : null]}>
              <Text style={[styles.lapText, {color: 
                item === maxLap ? 'red' : 
                item === minLap ? 'green' : 'white'}]}>
                <Text style={{fontWeight: 'bold'}}>Lap {index + 1}: </Text>{" "}
                {formatTime(item)}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.lapsList}
          contentContainerStyle={styles.lapsListContainer}
          inverted
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lapsContainer: {
    flex: 1,
    alignSelf: 'stretch',
  },
  time: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  startStopButton: {
    backgroundColor: 'green',
  },
  resetButton: {
    backgroundColor: 'gray',
  },
  lapButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
  lapItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  maxLapItem: {
    backgroundColor: 'black',
  },
  minLapItem: {
    backgroundColor: 'black',
  },
  lapText: {
    fontSize: 18,
    justifyContent: 'space-around',
  },
  lapsList: {
    flex: 1,
    alignSelf: 'stretch',
  },
  lapsListContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

export default App;
