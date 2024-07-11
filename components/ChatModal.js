import { Ionicons } from '@expo/vector-icons';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, SafeAreaView, Modal, Platform } from 'react-native';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useUser } from '../context/UserContext';
import { ip, port, chatPort } from '../core/utils'; // Adăugați calea corectă pentru utilitățile dvs.

const ChatModal = ({ visible, onClose, eventId }) => {
    const { userData } = useUser();
    const [newMessage, setNewMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const scrollViewRef = useRef();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://${ip}:${chatPort}/messages/${eventId}`);
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };

        fetchMessages();

        console.log('Opening Web Socket...');
        const socket = new SockJS(`http://${ip}:${chatPort}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                // console.log(str);
            },
            onConnect: () => {
                console.log('Connected');
                client.subscribe(`/topic/public/${eventId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    //console.log('Received message:', receivedMessage); // Log received messages
                    setMessages(prevMessages => [...prevMessages, receivedMessage]);
                });
            },
            onWebSocketClose: () => {
                console.log('WebSocket connection closed');
            },
            onWebSocketError: (error) => {
                console.error('WebSocket error:', error);
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [eventId]);

    const sendMessage = () => {
        if (stompClient && stompClient.connected && newMessage.trim()) {
            const message = {
                senderId: userData.id,
                senderName: userData.username,
                receiverId: eventId,
                message: newMessage.trim(),
                date: new Date().toISOString(),
                status: 'MESSAGE',
            };
            stompClient.publish({ destination: `/app/message`, body: JSON.stringify(message) });

            setNewMessage('');
        } else {
            console.log("Socket is not ready or message is empty.");
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close-circle" size={36} color="black" />
                        </TouchableOpacity>
                        <ScrollView
                            ref={scrollViewRef}
                            onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                            style={{ flex: 1 }}
                        >
                            {messages.sort((a, b) => new Date(a.date) - new Date(b.date)).map((message) => (
                                <View key={message.id} style={[styles.messageContainer, message.senderId === userData.id ? styles.myMessage : styles.otherMessage]}>
                                    <Text style={styles.sender}>{message.senderName}</Text>
                                    <Text style={styles.messageText}>{message.message}</Text>
                                    <Text style={styles.dateText}>{new Date(message.date).toLocaleTimeString()}</Text>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={newMessage}
                                onChangeText={text => setNewMessage(text)}
                                placeholder="Scrie un mesaj..."
                                placeholderTextColor="black"
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                                <Text style={styles.sendButtonText}>Trimite</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
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
    container: {
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 10,
        paddingVertical: 35,
        borderRadius: 10,
        width: "100%",
        height: "100%",
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    messageContainer: {
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E5E5EA',
    },
    sender: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    messageText: {
        fontSize: 16,
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#CCCCCC',
        paddingBottom: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        paddingHorizontal: 10,
        borderRadius: 20,
        marginRight: 10,

    },
    sendButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 10,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

});

export default ChatModal;
