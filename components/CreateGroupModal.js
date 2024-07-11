// CreateGroupModal.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ip, port } from '../core/utils';
import { useUser } from '../context/UserContext';
import Logo from '../components/Logo';
const CreateGroupModal = ({ visible, onClose }) => {
    const { userData } = useUser();
    const [name, setName] = useState('');
    const [details, setDetails] = useState('');
    const [location, setLocation] = useState('');

    const handleCreateGroup = async () => {
        const newGroup = {
            creator: userData.username,
            name,
            details,
            location,
            dateOfCreation: new Date().toISOString(),
        };

        try {
            const response = await fetch(`http://${ip}:${port}/group/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGroup),
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Group created successfully:', result);
                // Resetează câmpurile și închide modalul după succes
                setName('');
                setDetails('');
                setLocation('');
                onClose();
            } else {
                console.error('Failed to create group:', result);
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }
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
                <ScrollView>
                    <SafeAreaView style={styles.fullScreenModal}>
                        <Logo />
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close-circle" size={36} color="black" />
                        </TouchableOpacity>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalText}>Pagina creare grup</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Numele grupului"
                                value={name}
                                onChangeText={setName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Descrierea grupului"
                                value={details}
                                onChangeText={setDetails}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Orașul"
                                value={location}
                                onChangeText={setLocation}
                            />
                            <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
                                <Text style={styles.createButtonText}>Creează grup</Text>
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
        backgroundColor: "#f0f0f0f0",
        paddingTop: 40,

    },
    fullScreenModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f0f0f0f0",
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1000,
    },
    modalContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
    modalText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
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

export default CreateGroupModal;
