import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ip, port } from '../core/utils';
import { useUser } from '../context/UserContext';
import Logo from '../components/Logo';

const CreateEventModal = ({ visible, onClose, groupId }) => {
    const { userData } = useUser();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState(new Date());
    const [noOfPlayers, setNoOfPlayers] = useState('');
    const [noOfTeams, setNoOfTeams] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleCreateEvent = async () => {
        const newEvent = {
            creator: userData.username,
            date: date.toISOString(),
            noOfPlayers: parseInt(noOfPlayers),
            noOfTeams: parseInt(noOfTeams),
            description,
            location,
            groupId: groupId,
            name, // Adăugăm numele evenimentului
        };

        try {
            const response = await fetch(`http://${ip}:${port}/event/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Event created successfully:', result);
                // Resetează câmpurile și închide modalul după succes
                setName('');
                setDescription('');
                setLocation('');
                setDate(new Date());
                setNoOfPlayers('');
                setNoOfTeams('');
                onClose();
            } else {
                console.error('Failed to create event:', result);
            }
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0} // Adjust this value as needed
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <SafeAreaView style={styles.fullScreenModal}>
                        <View style={styles.logoContainer}>
                            <Logo />
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close-circle" size={36} color="black" />
                        </TouchableOpacity>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Creare eveniment</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nume"
                                    value={name}
                                    onChangeText={setName}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Descrierea evenimentului"
                                    value={description}
                                    onChangeText={setDescription}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Locația"
                                    value={location}
                                    onChangeText={setLocation}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Număr de jucători"
                                    value={noOfPlayers}
                                    onChangeText={setNoOfPlayers}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Număr de echipe"
                                    value={noOfTeams}
                                    onChangeText={setNoOfTeams}
                                    keyboardType="numeric"
                                />
                                <Text style={styles.dateLabel}>Selectează data evenimentului</Text>
                                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                                    <Text style={styles.dateText}>{date.toLocaleString()}</Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="datetime"
                                        display="default"
                                        onChange={onDateChange}
                                    />
                                )}
                            </View>
                            <TouchableOpacity style={styles.createButton} onPress={handleCreateEvent}>
                                <Text style={styles.createButtonText}>Creează eveniment</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 40,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logoContainer: {
        position: 'absolute',
        top: 20,
        left: '5%',
        right: '5%',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1000,
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 100,
    },
    modalText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        width: '80%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        justifyContent: 'center',
    },
    dateText: {
        color: 'black',
    },
    dateLabel: {
        alignSelf: 'flex-start',
        marginBottom: 5,
        marginLeft: '5%',
        color: 'black',
        fontWeight: 'bold',
    },
    createButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default CreateEventModal;
