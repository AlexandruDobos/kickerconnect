import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ip, port } from '../core/utils';
import UserChatModal from './UserChatModal';
import { useUser } from '../context/UserContext';

const ProfileModal = ({ visible, onClose, userId, username }) => {
    const { userData, updateUserData } = useUser();
    const [profileData, setProfileData] = useState({
        city: '',
        dateOfBirth: '',
        description: '',
        id: '',
        name: '',
        username: '',
        phoneNo: '',
        skills: [],
        availableDates: [],
        stars: 0,
        profileImage: '',
    });
    const [age, setAge] = useState('');
    const [isChatModalVisible, setIsChatModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [userRatings, setUserRatings] = useState([]);
    const [userRating, setUserRating] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchUserProfile();
            fetchUserRatings();
        }
    }, [visible, userId]);

    const fetchUserProfile = () => {
        const fetchUrl = `http://${ip}:${port}/user?user=${userId}`;

        fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if (!data.errorMessage) {
                const dateOfBirth = data.dateOfBirth || '';
                setProfileData({
                    city: data.city || '',
                    description: data.description || '',
                    id: data.id || '',
                    name: data.name || '',
                    username: data.username || '',
                    phoneNo: data.phoneNo || '',
                    dateOfBirth: dateOfBirth,
                    skills: data.skills || [],
                    availableDates: data.availableDates.filter(date => new Date(date) >= new Date()) || [],
                    stars: data.stars || 0,
                    profileImage: data.profileImage || '',
                });
                if (dateOfBirth) {
                    setAge(calculateAge(dateOfBirth));
                }
            }
        })
        .catch((error) => {
            console.error('Error fetching user profile:', error);
        });
    };

    const fetchUserRatings = () => {
        const fetchUrl = `http://${ip}:${port}/rating?userId=${userId}`;

        fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((data) => {
            if (Array.isArray(data)) {
                setUserRatings(data);
                const userRating = data.find(rating => rating.ratingUserId === userData.id);
                setUserRating(userRating);
            } else {
                console.error('Unexpected response format:', data);
            }
        })
        .catch((error) => {
            console.error('Error fetching user ratings:', error);
        });
    };

    const calculateAge = (dateOfBirth) => {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const openChatModal = () => {
        setIsChatModalVisible(true);
    };

    const closeChatModal = () => {
        setIsChatModalVisible(false);
    };

    const handleRatingSubmit = () => {
        const fetchUrl = `http://${ip}:${port}/rating/add`;

        const ratingData = {
            ratingUserId: userData.id,
            ratedUserId: profileData.id,
            stars: rating,
            comment: comment,
        };

        fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ratingData),
        })
        .then((response) => response.json())
        .then((data) => {
            if (!data.errorMessage) {
                fetchUserRatings();
                setRating(0);
                setComment('');
            }
        })
        .catch((error) => {
            console.error('Error submitting rating:', error);
        });
    };

    const handleRatingEdit = () => {
        console.log("am intrat aici");
        const fetchUrl = `http://${ip}:${port}/rating/edit`;
    
        const ratingData = {
            ratingUserId: userData.id,
            ratedUserId: profileData.id,
            stars: rating,
            comment: comment,
        };
    
        console.log("Trimit datele de rating: ", ratingData);
    
        fetch(fetchUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ratingData),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (!data.errorMessage) {
                console.log("Rating actualizat cu succes:", data);
                fetchUserRatings();
                setRating(0);
                setComment('');
                setIsEditing(false);
            } else {
                console.error('Eroare la actualizarea ratingului:', data.errorMessage);
            }
        })
        .catch((error) => {
            console.error('Error editing rating:', error);
        });
    };
    

    const fieldLabels = {
        stars: 'Stele',
        city: 'Oraș',
        dateOfBirth: 'Data nașterii',
        description: 'Descriere',
        name: 'Nume',
        username: 'Username',
        phoneNo: 'Număr telefon',
        age: 'Vârstă',
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
                <View style={styles.content}>
                    <View style={styles.frontView}>
                        <View style={styles.imageContainer}>
                            {profileData.profileImage ? (
                                <Image source={{ uri: `http://${ip}:${port}/uploads/${profileData.profileImage}` }} style={styles.profileImage} />
                            ) : (
                                <Image source={{ uri: 'https://cdn-icons-png.freepik.com/512/3106/3106773.png' }} style={styles.profileImage} />
                            )}
                        </View>
                        <Text style={styles.text}>Profil {profileData.username} </Text>
                    </View>
                    <View style={styles.divider} />
                    {userData.name !== profileData.name &&
                        <TouchableOpacity style={styles.messageButton} onPress={openChatModal}>
                            <Text style={styles.messageButtonText}>Send message</Text>
                        </TouchableOpacity>
                    }
                    {Object.keys(profileData).map((key) => (
                        key !== 'id' && key !== 'skills' && key !== 'availableDates' && key !== 'profileImage' && (
                            <View key={key} style={styles.fieldContainer}>
                                <Text style={styles.label}>{fieldLabels[key]}</Text>
                                <Text style={styles.value}>{key === 'stars' ? profileData[key] : profileData[key]}</Text>
                            </View>
                        )
                    ))}
                    {profileData.dateOfBirth && (
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>{fieldLabels.age}</Text>
                            <Text style={styles.value}>{age} ani</Text>
                        </View>
                    )}
                    <View style={styles.divider} />
                    <View style={styles.skillsContainer}>
                        <Text style={styles.skillsLabel}>Skills</Text>
                        <View style={styles.skillsList}>
                            {profileData.skills.map((skill, index) => (
                                <View key={index} style={styles.skillItem}>
                                    <Text style={styles.skillText}>{skill}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.skillsContainer}>
                        <Text style={styles.skillsLabel}>Disponibilitate</Text>
                        <View style={styles.availableDatesList}>
                            {profileData.availableDates.map((date, index) => (
                                <View key={index} style={styles.availableDateItem}>
                                    <Text style={styles.availableDateText}>{new Date(date).toLocaleString()}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={styles.divider} />
                    {userData.name !== profileData.name && !userRating && (
                        <View style={styles.ratingContainer}>
                            <Text style={styles.skillsLabel}>Adaugă un rating</Text>
                            <View style={styles.ratingStars}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                        <Ionicons
                                            name={rating >= star ? "star" : "star-outline"}
                                            size={24}
                                            color="gold"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TextInput
                                style={styles.ratingInput}
                                placeholder="Adaugă un comentariu"
                                value={comment}
                                onChangeText={setComment}
                            />
                            <TouchableOpacity style={styles.submitButton} onPress={handleRatingSubmit}>
                                <Text style={styles.submitButtonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {isEditing && (
                        <View style={styles.ratingContainer}>
                            <Text style={styles.skillsLabel}>Editează ratingul</Text>
                            <View style={styles.ratingStars}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                        <Ionicons
                                            name={rating >= star ? "star" : "star-outline"}
                                            size={24}
                                            color="gold"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TextInput
                                style={styles.ratingInput}
                                placeholder="Editează comentariul"
                                value={comment}
                                onChangeText={setComment}
                            />
                            <TouchableOpacity style={styles.submitButton} onPress={handleRatingEdit}>
                                <Text style={styles.submitButtonText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.divider} />
                    <View style={styles.ratingsContainer}>
                        <Text style={styles.skillsLabel}>Ratinguri primite:</Text>
                        {userRatings.map((rating) => (
                            <View key={rating.id} style={styles.ratingCard}>
                                <Text style={styles.ratingStars}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Ionicons
                                            key={star}
                                            name={rating.stars >= star ? "star" : "star-outline"}
                                            size={16}
                                            color="gold"
                                        />
                                    ))}
                                </Text>
                                <Text style={styles.ratingComment}>{rating.comment}</Text>
                                {rating.ratingUserId === userData.id && (
                                    <TouchableOpacity style={styles.editButton} onPress={() => {
                                        setRating(rating.stars);
                                        setComment(rating.comment);
                                        setUserRating(rating);
                                        setIsEditing(true); // Enable editing mode
                                    }}>
                                        <Text style={styles.editButtonText}>Edit</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <UserChatModal
                visible={isChatModalVisible}
                onClose={closeChatModal}
                userId={userId}
                username={username}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: "#f0f0f0f0",
    },
    divider: {
        height: 1,
        width: '95%',
        backgroundColor: '#CED0CE',
        marginVertical: 15,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1000,
    },
    content: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    frontView: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333333',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginBottom: 10,
    },
    messageButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginBottom: 20,
    },
    messageButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
        paddingLeft: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 120,
        color: '#333333',
    },
    skillsLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    value: {
        flex: 1,
        padding: 5,
        marginLeft: 20,
        color: '#333333',
    },
    skillsContainer: {
        width: '100%',
        marginTop: 0,
        marginBottom: 10,
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center"
    },
    skillsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skillItem: {
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        margin: 5,
    },
    skillText: {
        textAlign: "center",
    },
    availableDatesContainer: {
        width: '100%',
        marginTop: 20,
        paddingLeft: 20,
    },
    availableDatesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    availableDateItem: {
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        margin: 5,
    },
    availableDateText: {
        marginRight: 10,
        fontSize: 14,
    },
    ratingContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 20,
    },
    ratingStars: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    ratingInput: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginVertical: 10,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    ratingsContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    ratingCard: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'gray',
        marginVertical: 5,
    },
    ratingComment: {
        marginVertical: 5,
    },
    editButton: {
        alignSelf: 'flex-start',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
    },
    editButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default ProfileModal;
