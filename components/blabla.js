import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import { useUser } from '../context/UserContext';
import { ip, chatPort } from '../core/utils';
import UserChatModal from './UserChatModal';

const ConversationsModal = ({ visible, onClose }) => {
    const { userData } = useUser();
    const [conversations, setConversations] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isChatModalVisible, setIsChatModalVisible] = useState(false);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch(`http://${ip}:${chatPort}/user-messages/${userData.id}`);
                const data = await response.json();

                // Transformă datele pentru a grupa mesajele după utilizator
                const groupedConversations = data.reduce((acc, message) => {
                    const userId = message.senderId === userData.id ? message.receiverId : message.senderId;
                    if (!acc[userId]) {
                        acc[userId] = [];
                    }
                    acc[userId].push(message);
                    return acc;
                }, {});

                // Transformă obiectul într-un array de conversații
                const conversationsArray = Object.keys(groupedConversations).map(userId => {
                    const messages = groupedConversations[userId];
                    const lastMessage = messages[messages.length - 1];
                    return {
                        userId,
                        lastMessage,
                    };
                });

                setConversations(conversationsArray);
            } catch (error) {
                console.error('Failed to fetch conversations:', error);
            }
        };

        if (visible) {
            fetchConversations();
        }
    }, [visible]);

    const openChatModal = (userId) => {
        setSelectedUserId(userId);
        setIsChatModalVisible(true);
    };

    const closeChatModal = () => {
        setIsChatModalVisible(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.conversationItem} onPress={() => openChatModal(item.userId)}>
            <Image source={{ uri: 'https://cdn-icons-png.freepik.com/512/3106/3106773.png' }} style={styles.userIcon} />
            <View style={styles.conversationDetails}>
                <Text style={styles.userIdText}>User ID: {item.userId}</Text>
                <Text style={styles.lastMessageText}>{item.lastMessage.message}</Text>
                <Text style={styles.dateText}>{new Date(item.lastMessage.date).toLocaleString()}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={conversations}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.userId.toString()}
                        contentContainerStyle={styles.listContainer}
                    />
                </View>
            </View>
            <UserChatModal
                visible={isChatModalVisible}
                onClose={closeChatModal}
                userId={selectedUserId}
            />
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
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderRadius: 10,
        width: '90%',
        height: '80%',
    },
    closeButton: {
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    listContainer: {
        marginTop: 20,
    },
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    userIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    conversationDetails: {
        flex: 1,
    },
    userIdText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lastMessageText: {
        fontSize: 14,
        color: '#888',
    },
    dateText: {
        fontSize: 12,
        color: '#888',
    },
});

export default ConversationsModal;
