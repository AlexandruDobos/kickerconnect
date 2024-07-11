import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput } from 'react-native';
import { ImageBackground } from 'react-native';
import { useUser } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { ip, port } from '../core/utils';
const AddPlayerToEventModal = ({ event, onClose, isModalVisible, onUpdateEvent }) => {
    // Adaugă starea pentru gestionarea vizibilității ferestrei modale
    const { userData, updateUserData } = useUser();
    const [playerNameInput, setPlayerNameInput] = useState('');
    const [submitError, setSubmitError] = useState(null)
    const generateUniqueId = () => {
        const timestamp = Date.now();

        // Generează un număr aleatoriu între 0 și 9999
        const randomNum = Math.floor(Math.random() * 10000);

        // Construiește ID-ul unic combinând timestamp-ul și numărul aleatoriu
        //const uniqueId = parseInt(timestamp + '' + randomNum);
        const uniqueId = parseInt(randomNum);
        return uniqueId;
    };

    // Funcție pentru gestionarea textului introdus în caseta de text
    const handlePlayerNameInputChange = (text) => {
        const trimmedText = text.trim();
        setPlayerNameInput(trimmedText);
        if (trimmedText !== null && trimmedText !== "") {
            setSubmitError(null)
        } else {
            setSubmitError({ message: "Numele nu poate fi gol" })
        }
    };

    // Funcție pentru gestionarea acțiunii de submit
    const handleSubmit = () => {

        // Aici poți adăuga logica pentru a face ceva cu textul introdus, cum ar fi trimiterea lui către baza de date
        console.log('Player name:', playerNameInput);
        if (!playerNameInput.trim()) {
            setSubmitError({ message: "Numele nu poate fi gol" });
            return;
        }

        // Verifică dacă numele jucătorului este duplicat
        // event.registeredPlayers.forEach((player) => { console.log("Player name: ", player.name.replace(/Adaugat de \d+/, '').trim().toLowerCase() + " " + playerNameInput.toLowerCase()) })
        const isDuplicate = event.registeredPlayers.some(player => {
            if (player.username) {
                return player.username.replace(/Adaugat de \d+/, '').trim().toLowerCase() === playerNameInput.toLowerCase();
            }
            return false;
        });
        if (isDuplicate) {
            setSubmitError({ message: "Există deja un jucător cu acest nume" });
            return;
        }
        setSubmitError({ message: null })
        // Apoi închide fereastra modală
        //closeModal();
        const idUnic = generateUniqueId();
        console.log("unique id: " + idUnic);
        const userId = { username: playerNameInput + " Adaugat de " + userData.id, id: idUnic, stars: selectedRating };
        let registeredPlayers = event.registeredPlayers;
        registeredPlayers.push(userId);
        console.log(idUnic);
        event.registeredPlayers.forEach(element => {
            console.log(element.id)
        });

        setPlayerNameInput('');


        console.log('Fetching...');
        const fetchUrl = "http://" + ip + ":" + port + "/event?event=" + event.id

        fetch(fetchUrl, {

            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                registeredPlayers: registeredPlayers.map(player => ({ username: player.username, id: parseInt(player.id), stars: player.stars }))
            }),
        })
            .then((response) => {

                return response.json();
            })
            .then((data) => {

                if (data.errorMessage) {
                    console.log("Eroarea din AddPlayerToEventModal este: " + data.errorMessage)
                    //setLoginError({ error: data.errorMessage })
                } else {
                    console.log("Nu este eroare, am actualizat lista");
                    //console.log(data);
                    setPlayerNameInput('')
                    setSelectedRating(1)
                    onUpdateEvent(data); // Actualizează eventData în EventDetailsModal
                    onClose(); // Închide modalul
                }
                // Do something with the response, such as updating the UI or showing a success message
            })
            .catch((error) => {
                console.error('Error logging user:', error);
                // Handle the error, such as displaying an error message to the user
            });




        onClose();

    };

    const [selectedRating, setSelectedRating] = useState(1);
    // Funcție pentru gestionarea schimbării notei selectate
    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
        console.log(rating)
    };
    // În interiorul returnului, adaugă componenta Modal și conținutul său
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
    )

}

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