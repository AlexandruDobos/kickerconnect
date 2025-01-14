import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useUser } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { ip, port } from '../core/utils';

const AddPlayerToEventModal = ({ event, onClose, isModalVisible, onUpdateEvent }) => {
    const { userData } = useUser();
    const [playerNameInput, setPlayerNameInput] = useState('');
    const [submitError, setSubmitError] = useState(null);
    const [selectedRating, setSelectedRating] = useState(1);

    const generateUniqueId = () => {
        const randomNum = Math.floor(Math.random() * 10000);
        return parseInt(randomNum);
    };

    const handlePlayerNameInputChange = (text) => {
        const trimmedText = text.trim();
        setPlayerNameInput(trimmedText);
        if (trimmedText) {
            setSubmitError(null);
        } else {
            setSubmitError({ message: "Numele nu poate fi gol" });
        }
    };

    const handleSubmit = () => {
        if (!playerNameInput.trim()) {
            setSubmitError({ message: "Numele nu poate fi gol" });
            return;
        }

        const isDuplicate = event.registeredPlayers.some(player => {
            return player.username && player.username.trim().toLowerCase() === playerNameInput.toLowerCase();
        });

        if (isDuplicate) {
            setSubmitError({ message: "Există deja un jucător cu acest nume" });
            return;
        }

        setSubmitError(null);

        const idUnic = generateUniqueId();
        const newPlayer = { username: playerNameInput, id: idUnic, stars: selectedRating, isAddedBy: userData.username };
        console.log("new player", newPlayer)
        const updatedPlayers = [...event.registeredPlayers, newPlayer];

        const fetchUrl = `http://${ip}:${port}/event?event=${event.id}`;

        fetch(fetchUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                registeredPlayers: updatedPlayers.map(player => ({
                    username: player.username,
                    id: parseInt(player.id),
                    stars: player.stars,
                    isAddedBy: player.isAddedBy || null,
                })),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.errorMessage) {
                    console.log("Eroarea din AddPlayerToEventModal este: " + data.errorMessage);
                } else {
                    setPlayerNameInput('');
                    setSelectedRating(1);
                    onUpdateEvent(data);
                    onClose();
                }
            })
            .catch((error) => {
                console.error('Error updating event:', error);
            });

        onClose();
    };

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.content}>
                    <View style={styles.closeButton}>
                        <Ionicons onPress={onClose} name="close-circle" size={36} color="black" />
                    </View>
                    <TextInput
                        style={styles.input}
                        onChangeText={handlePlayerNameInputChange}
                        value={playerNameInput}
                        placeholder="Introdu numele jucătorului..."
                        placeholderTextColor="rgba(0, 0, 0, 0.5)"
                    />
                    <Text style={styles.label}>Alege nota</Text>
                    <View style={styles.squareContainer}>
                        {[1, 2, 3, 4, 5].map((number) => (
                            <TouchableOpacity
                                key={number}
                                style={[styles.square, selectedRating === number && styles.selectedSquare]}
                                onPress={() => handleRatingChange(number)}
                            >
                                <Text style={styles.squareText}>{number}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                    {submitError && <Text>{submitError.message}</Text>}
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '80%', // Poți ajusta lățimea conținutului după preferințe
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    input: {
        width: '100%', // Face ca caseta de text să ocupe întreaga lățime disponibilă
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        marginBottom: 20,
        marginTop: 40,
    },
    submitButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center', // Asigură alinierea centrului pentru butonul de submit
    },
    submitButtonText: {
        color: 'white',
    },
    squareContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    square: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedSquare: {
        backgroundColor: '#DDF2FD',
    },
    squareText: {
        fontSize: 18,
    },
    label: {
        marginBottom: 10
    },
});

export default AddPlayerToEventModal;
