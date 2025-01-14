// ComplaintModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ip, port } from '../core/utils';
import { useUser } from '../context/UserContext';

const ComplaintModal = ({ visible, onClose }) => {
    const { userData } = useUser();
    const [complaintText, setComplaintText] = useState('');
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        if (userData) {
            fetchComplaints();
        }
    }, [userData]);

    const fetchComplaints = () => {
        const fetchUrl = `http://${ip}:${port}/complaint/getAll`;

        fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const userComplaints = data.filter(complaint => complaint.creator === userData.username);
                setComplaints(userComplaints);
            })
            .catch((error) => {
                console.error('Error fetching complaints:', error);
            });
    };

    const handleSubmitComplaint = () => {
        const fetchUrl = `http://${ip}:${port}/complaint/add`;

        const complaintDTO = {
            creator: userData.username,
            content: complaintText,
            launchedTime: new Date().toISOString(),
            resolvedTime: null,
            isResolved: false,
        };

        fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(complaintDTO),
        })
            .then((response) => response.json())
            .then((data) => {
                setComplaints(prevComplaints => [...prevComplaints, data]);
                setComplaintText('');
                console.log(data)
            })
            .catch((error) => {
                console.error('Error submitting complaint:', error);
            });
    };

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close-circle" size={36} color="black" />
                </TouchableOpacity>
                <Text style={styles.text}>Pagina de reclamații</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Scrie reclamația ta aici"
                    value={complaintText}
                    onChangeText={setComplaintText}
                    multiline
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmitComplaint}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <View style={styles.complaintsContainer}>
                    <Text style={styles.sectionTitle}>Reclamațiile tale:</Text>
                    {complaints.length === 0 ? (
                        <Text style={styles.noComplaintsText}>Nu ai făcut nicio reclamație până acum</Text>
                    ) : (
                        complaints.map((complaint) => (
                            <View key={complaint.id} style={styles.complaintCard}>
                                <Text style={styles.complaintContent}>{complaint.content}</Text>
                                <View style={styles.complaintFooter}>
                                    <Text style={styles.complaintDate}>
                                        {new Date(complaint.launchedTime).toLocaleString()}
                                    </Text>
                                    {complaint.resolved && complaint.resolvedTime && (
                                        <Text style={styles.resolvedDate}>
                                            Rezolvat: {new Date(complaint.resolvedTime).toLocaleString()}
                                        </Text>
                                    )}
                                    <Ionicons 
                                        name={complaint.resolved ? "checkmark-circle" : "alert-circle"} 
                                        size={24} 
                                        color={complaint.resolved ? "green" : "red"} 
                                    />
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#f0f0f0',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    text: {
        fontSize: 24,
        textAlign: 'center',
        color: '#333333',
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        padding: 10,
        backgroundColor: '#124076',
        borderRadius: 5,
        marginVertical: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    complaintsContainer: {
        width: '90%',
        padding: 10,
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    noComplaintsText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'gray',
    },
    complaintCard: {
        padding: 10,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 5,
    },
    complaintContent: {
        fontSize: 16,
    },
    complaintFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    complaintDate: {
        fontSize: 12,
        color: 'gray',
    },
    resolvedDate: {
        fontSize: 12,
        color: 'green',
    },
});

export default ComplaintModal;
