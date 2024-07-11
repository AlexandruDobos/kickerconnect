import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Button, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ip, port } from '../core/utils';
import ProfileModal from './ProfileModal'; // Importă ProfileModal

const PlayerAvailabilityModal = ({ visible, onClose }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(true);
    const [showEndDatePicker, setShowEndDatePicker] = useState(true);
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null); // Stare pentru utilizatorul selectat
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false); // Stare pentru vizibilitatea ProfileModal

    useEffect(() => {
        if (visible) {
            setPlayers([]);
        }
    }, [visible]);

    const onStartDateChange = (event, selectedDate) => {
        //  setShowStartDatePicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    const onEndDateChange = (event, selectedDate) => {
        //   setShowEndDatePicker(false);
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    const fetchAvailablePlayers = async () => {
        try {
            const response = await fetch(`http://${ip}:${port}/user/available-users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ startDate, endDate }),
            });
            const data = await response.json();
            setPlayers(data);
        } catch (error) {
            console.error('Failed to fetch available players:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('ro-RO', options);
    };

    const openProfile = (player) => {
        setSelectedPlayer(player);
        setIsProfileModalVisible(true);
    };

    const closeProfileModal = () => {
        setIsProfileModalVisible(false);
        setSelectedPlayer(null);
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
                    <Text style={styles.text}>Disponibilitate Jucători</Text>

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

                        <TouchableOpacity style={styles.searchButton} onPress={fetchAvailablePlayers}>
                            <Text style={styles.searchButtonText}>Caută jucători disponibili</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        {players.length > 0 ? (
                            players.map((player, index) => (
                                <TouchableOpacity key={index} style={styles.playerItem} onPress={() => openProfile(player)}>
                                    <Text style={styles.playerName}>{player.username}</Text>
                                    {player.availableDates
                                        .filter(date => new Date(date) >= startDate && new Date(date) <= endDate)
                                        .map((date, dateIndex) => (
                                            <Text key={dateIndex} style={styles.availableDateText}>{formatDate(date)}</Text>
                                        ))}
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.noPlayersText}>Nu există jucători disponibili</Text>
                        )}
                    </ScrollView>
                    {selectedPlayer && (
                        <ProfileModal
                            visible={isProfileModalVisible}
                            onClose={closeProfileModal}
                            userId={selectedPlayer.id}
                        />
                    )}
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
    noPlayersText: {
        fontSize: 16,
        color: 'gray',
        marginTop: 20,
    },
    playerItem: {
        width: '100%',
        marginVertical: 10,
        backgroundColor: '#E0F7FA',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
    },
    playerName: {
        fontSize: 16,
        fontWeight: 'bold',
        
    },
    availableDateText: {
        fontSize: 14,
        color: 'gray',
    },
    dateTimePickerStyle: {
        width: "100%",
        alignSelf: "center"
    },
    searchButton: {
        marginTop: 20,
        backgroundColor: '#124076',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        alignSelf: 'center'
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PlayerAvailabilityModal;
