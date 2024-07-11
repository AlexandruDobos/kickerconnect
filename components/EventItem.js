import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventDetailsModal from './EventDetailsModal'; // Import EventDetailsModal
import { useEvent } from '../context/EventContext';

const EventItem = ({ groupEvent, onChangeGroupEvent, style }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { updateEventData } = useEvent();

  const eventDate = new Date(groupEvent.date);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dayOfWeek = eventDate.toLocaleDateString('ro-RO', options);
  const formattedTime = eventDate.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });

  const handlePressEvent = () => {
    updateEventData(groupEvent);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.eventItem, style]} onPress={handlePressEvent}>
        <Ionicons name="calendar-outline" size={24} color="black" />
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{groupEvent.name}</Text>
          <Text style={styles.eventDate}>{`${dayOfWeek}, ${formattedTime}`}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <EventDetailsModal
        event={groupEvent}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onUpdateEvent={onChangeGroupEvent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#B2EBF2',
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  eventDetails: {
    flex: 1,
    marginLeft: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 14,
    color: 'gray',
  },
});

export default EventItem;
