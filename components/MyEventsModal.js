import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventItem from './EventItem';
import { useUser } from '../context/UserContext'; // Importă contextul utilizatorului
import { ip, port } from '../core/utils';

const MyEventsModal = ({ visible, onClose }) => {
    const { userData } = useUser(); // Utilizează datele utilizatorului
    const [futureEvents, setFutureEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible) {
            fetchMyEvents();
        }
    }, [visible]);

    const fetchMyEvents = async () => {
        try {
            const response = await fetch(`http://${ip}:${port}/group/getAll`);
            const data = await response.json();
            let future = [];
            let past = [];
            const now = new Date();

            data.forEach(group => {
                group.events.forEach(event => {
                    if (event.registeredPlayers && event.registeredPlayers.some(player => player.id === userData.id)) {
                        if (new Date(event.date) >= now) {
                            future.push(event);
                        } else {
                            past.push(event);
                        }
                    }
                });
            });

            future.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sortare după dată
            past.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sortare descrescătoare după dată
            setFutureEvents(future);
            setPastEvents(past);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
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
                    <Text style={styles.text}>Evenimentele mele</Text>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Text style={styles.sectionTitle}>Evenimente viitoare</Text>
                        {futureEvents.length > 0 ? (
                            futureEvents.map((event, index) => (
                                <EventItem key={index} groupEvent={event} />
                            ))
                        ) : (
                            !loading && <Text style={styles.noEventsText}>Nu ești înscris la evenimente viitoare</Text>
                        )}
                        <Text style={styles.sectionTitle}>Evenimente trecute</Text>
                        {pastEvents.length > 0 ? (
                            pastEvents.map((event, index) => (
                                <EventItem key={index} groupEvent={event} />
                            ))
                        ) : (
                            !loading && <Text style={styles.noEventsText}>Nu ai fost înscris la evenimente trecute</Text>
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
    text: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 70,
        color: '#333333',
        fontWeight: "bold",
    },
    scrollContainer: {
        width: '100%',
        paddingHorizontal: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'left',
    },
    noEventsText: {
        fontSize: 16,
        color: 'gray',
        marginTop: 20,
        textAlign: 'center',
    },
});

export default MyEventsModal;
