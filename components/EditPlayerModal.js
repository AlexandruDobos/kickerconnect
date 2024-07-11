import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EditPlayerModal = ({ player, onClose, onSave }) => {
    const [username, setUsername] = useState(player.username.replace(/Adaugat de \d+/, '').trim() || '');
    const [stars, setStars] = useState(player.stars || 1);
    const [isAddedBy, setIsAddedBy] = useState(player.isAddedBy || '');

    const handleSave = () => {
        onSave({ ...player, username: username.trim(), stars, isAddedBy });
        onClose();
    };

    const handleRatingChange = (stars) => {
        setStars(stars);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.content}>
                    <View style={styles.closeButton}>
                        <Ionicons onPress={onClose} name="close-circle" size={36} color="black" />
                    </View>
                    <Text style={styles.title}>Edit Player</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        placeholderTextColor="black"
                    />
                    <View style={styles.squareContainer}>
                        {[1, 2, 3, 4, 5].map((number) => (
                            <TouchableOpacity
                                key={number}
                                style={[styles.square, stars === number && styles.selectedSquare]}
                                onPress={() => handleRatingChange(number)}
                            >
                                <Text style={styles.squareText}>{number}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity onPress={handleSave} style={styles.button}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: 'black',
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    cancelButton: {
        backgroundColor: 'gray',
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
        backgroundColor: 'blue',
    },
    squareText: {
        fontSize: 18,
    },
});

export default EditPlayerModal;
