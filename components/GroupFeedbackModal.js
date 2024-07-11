import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ip, port } from '../core/utils';
import { useUser } from '../context/UserContext';
import ProfileModal from './ProfileModal'; // Importați componenta ProfileModal

const GroupFeedbackModal = ({ visible, onClose, groupName, groupId }) => {
    const { userData } = useUser();
    const [isFeedbackFormVisible, setIsFeedbackFormVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [stars, setStars] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUsername, setSelectedUsername] = useState('');

    useEffect(() => {
        if (visible) {
            fetchReviews();
        }
    }, [visible]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://${ip}:${port}/review/group/${groupId}`);
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleFeedbackSubmit = async () => {
        const reviewDTO = {
            username: userData.username,
            userId: userData.id,
            group: groupId,
            message,
            stars,
            date: new Date().toISOString(),
            isActive: true
        };
        console.log(reviewDTO)
        try {
            const response = await fetch(`http://${ip}:${port}/review/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewDTO),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Review submitted successfully:', data);
                // Reset form
                setMessage('');
                setStars(1);
                setIsFeedbackFormVisible(false);
                fetchReviews(); // Re-fetch reviews after submitting
            } else {
                console.error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleOpenProfileModal = (userId, username) => {
        setSelectedUserId(userId);
        setSelectedUsername(username);
        setIsProfileModalVisible(true);
    };

    const handleCloseProfileModal = () => {
        setIsProfileModalVisible(false);
        setSelectedUserId(null);
        setSelectedUsername('');
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity key={value} onPress={() => setStars(value)}>
                <Ionicons
                    name={value <= stars ? "star" : "star-outline"}
                    size={36}
                    color="gold"
                />
                <Text style={styles.starLabel}>{value} {value > 1 ? 'stele' : 'stea'}</Text>
            </TouchableOpacity>
        ));
    };

    const renderReviewItem = ({ item }) => (
        <View style={styles.reviewItem}>
            <TouchableOpacity onPress={() => handleOpenProfileModal(item.userId, item.username)}>
                <Text style={styles.reviewUsername}>{item.username}</Text>
            </TouchableOpacity>
            <View style={styles.reviewStars}>
                {[...Array(item.stars)].map((_, index) => (
                    <Ionicons key={index} name="star" size={16} color="gold" />
                ))}
                {[...Array(5 - item.stars)].map((_, index) => (
                    <Ionicons key={index} name="star-outline" size={16} color="gold" />
                ))}
            </View>
            <Text style={styles.reviewMessage}>{item.message}</Text>
            <Text style={styles.reviewDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
    );

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.addButton} onPress={() => setIsFeedbackFormVisible(!isFeedbackFormVisible)}>
                            <Ionicons name="add-circle" size={36} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close-circle" size={36} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.text}>Feedback {groupName}</Text>
                    {isFeedbackFormVisible && (
                        <View style={styles.form}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Scrie feedback-ul aici"
                                value={message}
                                onChangeText={setMessage}
                                multiline
                            />
                            <View style={styles.starsContainer}>
                                {renderStars()}
                            </View>
                            {/* <Button style={styles.sendFeedbackButton} title="Trimite feedback" onPress={handleFeedbackSubmit} /> */}
                            <TouchableOpacity style={styles.sendFeedbackButton} onPress={handleFeedbackSubmit}>
                            <Text style={styles.sendFeedbackButtonText}>Trimite feedback</Text>
                        </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.flatListStyle}>
                        <FlatList
                            data={reviews}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderReviewItem}
                            contentContainerStyle={styles.reviewList}
                        />
                    </View>
                </View>
            </SafeAreaView>
            <ProfileModal
                visible={isProfileModalVisible}
                onClose={handleCloseProfileModal}
                userId={selectedUserId}
                username={selectedUsername}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",

    },
    modalContent: {
        width: '100%',
        height: '100%',
        marginTop: '10%',
        paddingHorizontal: 20,
        paddingTop: '10%',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        marginBottom: '5%',
    },
    closeButton: {},
    addButton: {},
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    form: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    textInput: {
        width: '100%',
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    starLabel: {
        textAlign: 'center',
        marginTop: 5,
    },
    flatListStyle: {
        width: "100%",
    },
    reviewList: {
        width: '100%',
    },
    reviewItem: {
        backgroundColor: '#F9F9F9',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: "80%",
        alignSelf: "center"
    },
    reviewUsername: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    reviewStars: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    reviewMessage: {
        marginBottom: 5,
    },
    reviewDate: {
        fontSize: 12,
        color: 'gray',
        textAlign: 'right',
    },
    sendFeedbackButton:{
        backgroundColor: '#124076',
        padding: 25,
        borderRadius: 5
    },
    sendFeedbackButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default GroupFeedbackModal;
