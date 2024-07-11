import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Logo from '../components/Logo';
const EditPlayerModal = ({ player, onClose, onSave }) => {
    const [editedName, setEditedName] = useState(player.name.replace(/Adaugat de \d+/, '').trim() || '');
    const [selectedStars, setSelectedStars] = useState(player.stars || 1);

    const handleSave = () => {
        onSave({ id: player.id, name: player.name.replace(/Adaugat de \d+/, '').trim(), stars: selectedStars }); // Salvăm modificările jucătorului
        onClose(); // Închidem fereastra modală
    };

    const handleRatingChange = (stars) => {
        setSelectedStars(stars);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={true}>
            
            <View style={styles.modalContainer}>
                
                <View style={styles.content}>
                
                    <Text style={styles.title}>Edit player</Text>
                    <TextInput
                        style={styles.input}
                        value={editedName}
                        onChangeText={text => setEditedName(text)}
                        placeholder="Player name"
                    />
                    <View style={styles.squareContainer}>

                        {[1, 2, 3, 4, 5].map((number) => (
                            <TouchableOpacity
                                key={number}
                                style={[styles.square, selectedStars === number && styles.selectedSquare]}
                                onPress={() => handleRatingChange(number)}
                            >
                                <Text style={styles.squareText}>{number}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity onPress={handleSave} style={styles.button}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={styles.button}>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        
    },
    content: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
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
