import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Button, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker'; // Asigură-te că ai instalat această librărie
import EventItem from './EventItem'; // Importă componenta EventItem
import { ip, port } from '../core/utils'; // Asigură-te că calea este corectă

const AvailableEventsModal = ({ visible, onClose }) => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(true);
    const [showEndDatePicker, setShowEndDatePicker] = useState(true);

    useEffect(() => {
        if (visible) {
            fetchEvents();
        }
    }, [visible]);

    const fetchEvents = async () => {
        try {
            const response = await fetch(`http://${ip}:${port}/group/getAll`);
            const data = await response.json();
            let allEvents = [];
            data.forEach(group => {
                const availableEvents = group.events.filter(event => new Date(event.date) > new Date());
                allEvents = [...allEvents, ...availableEvents];
            });
            allEvents.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sortarea evenimentelor după dată
            setEvents(allEvents);
            setFilteredEvents(allEvents); // Inițial setăm evenimentele filtrate la toate evenimentele
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    };

    const onStartDateChange = (event, selectedDate) => {
        // setShowStartDatePicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
            filterEvents(selectedDate, endDate);
        }
    };

    const onEndDateChange = (event, selectedDate) => {
        //setShowEndDatePicker(false);
        if (selectedDate) {
            setEndDate(selectedDate);
            filterEvents(startDate, selectedDate);
        }
    };

    const filterEvents = (start, end) => {
        const filtered = events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= start && eventDate <= end;
        });
        setFilteredEvents(filtered);
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close-circle" size={36} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.text}>Pagina evenimente disponibile</Text>

                    <View style={styles.filterContainer}>
                        <Button style={styles.selectDateButton} onPress={() => setShowStartDatePicker(true)} title="Selectează data de început" />
                        {showStartDatePicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                onChange={onStartDateChange}
                                style={styles.dateTimePickerStyle}
                            />
                        )}
                        <Button style={styles.selectDateButton} onPress={() => setShowEndDatePicker(true)} title="Selectează data de sfârșit" />
                        {showEndDatePicker && (
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                onChange={onEndDateChange}
                                style={styles.dateTimePickerStyle}
                            />
                        )}
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event, index) => (
                                <EventItem key={index} groupEvent={event} />
                            ))
                        ) : (
                            <Text style={styles.noEventsText}>Nu există evenimente disponibile</Text>
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop: Platform.OS === 'ios' ? 0 : 0,
        backgroundColor: "#f0f0f0f0"
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40, // Ajustează marginea pentru a fi sub notch
        right: 20, // Ajustează marginea pentru a fi sub notch
    },
    selectDateButton: {
        top: 40,
        marginBottom: 10,
    },
    text: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 70,
        color: '#333333',
        fontWeight: "bold",
    },
    filterContainer: {
    },
    scrollContainer: {
        width: '100%', // Asigură-te că ocupă întreaga lățime
        paddingHorizontal: 20, // Adaugă padding pentru a evita textul să fie tăiat
    },
    noEventsText: {
        fontSize: 16,
        color: 'gray',
        marginTop: 20,
    },
    eventItem: {
        width: '100%', // Ajustează dimensiunea pentru a fi uniformă
        marginVertical: 10, // Adaugă spațiu între evenimente
        backgroundColor: '#E0F7FA', // Fundal pentru a distinge evenimentele
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    dateTimePickerStyle: {
        width: "100%",
        alignSelf: "center"
    },
});

export default AvailableEventsModal;
