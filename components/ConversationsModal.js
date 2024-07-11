import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, Image } from 'react-native';
import { useUser } from '../context/UserContext';
import { ip, chatPort, port } from '../core/utils';
import UserChatModal from './UserChatModal';
import { Ionicons } from '@expo/vector-icons';

const ConversationsModal = ({ visible, onClose }) => {
    const { userData } = useUser();
    const [conversations, setConversations] = useState([]);
    const [profileImages, setProfileImages] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUsername, setSelectedUsername] = useState(null);
    const [isChatModalVisible, setIsChatModalVisible] = useState(false);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch(`http://${ip}:${chatPort}/user-messages/${userData.id}`);
                const data = await response.json();

                const groupedConversations = data.reduce((acc, message) => {
                    const userId = message.senderId === userData.id ? message.receiverId : message.senderId;
                    const username = message.senderId === userData.id ? message.receiverUsername : message.senderUsername;
                    if (!acc[userId]) {
                        acc[userId] = { messages: [], username: username };
                    }
                    acc[userId].messages.push(message);
                    return acc;
                }, {});

                let conversationsArray = Object.keys(groupedConversations).map(userId => {
                    const conversation = groupedConversations[userId];
                    const messages = conversation.messages;
                    const lastMessage = messages[messages.length - 1];

                    return {
                        userId,
                        username: conversation.username,
                        lastMessage,
                    };
                });

                // Sortare conversații în funcție de ora ultimului mesaj primit
                conversationsArray = conversationsArray.sort((a, b) => new Date(b.lastMessage.date) - new Date(a.lastMessage.date));

                setConversations(conversationsArray);
                fetchProfileImages(Object.keys(groupedConversations));
            } catch (error) {
                console.error('Failed to fetch conversations:', error);
            }
        };

        const fetchProfileImages = async (userIds) => {
            try {
                const profileImagesMap = {};
                for (const userId of userIds) {
                    const response = await fetch(`http://${ip}:${port}/user?user=${userId}`);
                    const data = await response.json();
                    profileImagesMap[userId] = data.profileImage;
                }
                setProfileImages(profileImagesMap);
            } catch (error) {
                console.error('Failed to fetch profile images:', error);
            }
        };

        if (visible) {
            fetchConversations();
        }
    }, [visible]);

    const openChatModal = (userId, username) => {
        setSelectedUserId(userId);
        setSelectedUsername(username);
        setIsChatModalVisible(true);
    };

    const closeChatModal = () => {
        setIsChatModalVisible(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.conversationItem} onPress={() => openChatModal(item.userId, item.username)}>
            <Image
                source={{ uri: profileImages[item.userId] ? `http://${ip}:${port}/uploads/${profileImages[item.userId]}` : 'https://cdn-icons-png.freepik.com/512/3106/3106773.png' }}
                style={styles.userIcon}
            />
            <View style={styles.conversationDetails}>
                <Text style={styles.clasicText}>{item.username}</Text>
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
                        <Ionicons name="close-circle" size={36} color="black" />
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
                username={selectedUsername}
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
        width: 75,
        height: 75,
        borderRadius: 40,
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
        marginBottom: 3,
        color: '#333333',
    },
    dateText: {
        fontSize: 12,
        color: '#888',
    },
    clasicText:{
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 3,
        color: '#333333',
    },
});

export default ConversationsModal;
