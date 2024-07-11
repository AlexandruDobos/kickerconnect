import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Button, StyleSheet, SafeAreaView, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground } from 'react-native';
import EventItem from './EventItem';
import { ip, port } from '../core/utils';
import MembersModal from './MembersModal';
import CreateEventModal from './CreateEventModal';
import GroupFeedbackModal from './GroupFeedbackModal'; // Importă noul modal

const GroupDetailsModal = ({ group, onClose, onJoin }) => {
    const [groupCopy, setGroupCopy] = useState(group);
    const { userData } = useUser();
    const [isInSelectedGroup, setIsInSelectedGroup] = useState(false);
    const [isMembersModalVisible, setIsMembersModalVisible] = useState(false);
    const [isCreateEventModalVisible, setIsCreateEventModalVisible] = useState(false);
    const [isGroupFeedbackModalVisible, setIsGroupFeedbackModalVisible] = useState(false); // Stare pentru vizibilitatea feedback modal

    // Obții data și ora dintr-un șir de caractere
    const dateString = group.dateOfCreation;
    const dateTime = new Date(dateString);
    // Extragi datea și ora
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const day = dateTime.getDate().toString().padStart(2, '0');
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');

    useEffect(() => {
        const userId = { id: userData.id };
        let groupMembers = group.members;

        const idExists = groupMembers.some(object => object.id === userData.id);
        if (idExists) {
            setIsInSelectedGroup(true);
        }

    }, []);

    const handleGroupEventChange = () => {
        const fetchUrl = "http://" + ip + ":" + port + "/group?group=" + group.id;
        fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                setGroupCopy(data)
            })
            .catch(error => console.log("Error selecting groups: " + error));
    }

    const handleLeaveGroup = () => {
        if (!isInSelectedGroup) return;

        const updatedMembers = group.members.filter(member => member.id !== userData.id);
        const fetchUrl = "http://" + ip + ":" + port + "/group?group=" + group.id;

        fetch(fetchUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ members: updatedMembers }),
        })
            .then(response => response.json())
            .then(data => {
                setGroupCopy(data);
                setIsInSelectedGroup(false);
                onClose(); // You may want to close the modal after leaving the group
            })
            .catch(error => console.error('Error leaving group:', error));
    }

    const handleOpenMembersModal = () => {
        setIsMembersModalVisible(true);
    }

    const handleCloseMembersModal = () => {
        setIsMembersModalVisible(false);
    }

    const handleOpenCreateEventModal = () => {
        setIsCreateEventModalVisible(true);
    }

    const handleCloseCreateEventModal = () => {
        setIsCreateEventModalVisible(false);
    }

    const handleOpenGroupFeedbackModal = () => {
        setIsGroupFeedbackModalVisible(true);
    }

    const handleCloseGroupFeedbackModal = () => {
        setIsGroupFeedbackModalVisible(false);
    }

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={true}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
            <ScrollView>
                
                    <View style={styles.content}>
                        <View style={styles.background}>
                            <ImageBackground source={require('../assets/images/groupImage.jpg')} style={[styles.backgroundImage, { opacity: 0.85 }]}>
                                <View style={styles.closeButtonContainer}>
                                    {isInSelectedGroup && (
                                        <Ionicons
                                            onPress={handleLeaveGroup}
                                            name="log-out-outline"
                                            size={36}
                                            color="black"
                                            style={styles.leaveButton}
                                        />
                                    )}
                                    <Ionicons onPress={handleOpenMembersModal} name="people-outline" size={36} color="black" style={styles.membersButton} />
                                    <Ionicons onPress={handleOpenGroupFeedbackModal} name="happy-outline" size={36} color="black" style={styles.feedbackButton} />
                                    <Ionicons onPress={onClose} name="close-circle" size={36} color="black" style={styles.closeButton} />
                                </View>
                                <Text style={styles.groupName}>{group.name}</Text>
                                <Text style={styles.groupCreation}>Creat la {`${day}.${month}.${year}`} de {group.creator}</Text>
                            </ImageBackground>
                            <View id='2' style={styles.overlay}>
                                <Text style={styles.firstText}>Detaliile grupului</Text>
                                <Text style={styles.secondText}>{group.details}</Text>
                            </View>
                        </View>
                        {isInSelectedGroup === false && (
                            <Button
                                title="Join"
                                onPress={() => {
                                    setIsInSelectedGroup(true);
                                    onJoin();
                                }}
                            />
                        )}

                        {isInSelectedGroup && (
                            <TouchableOpacity style={styles.createEventButton} onPress={handleOpenCreateEventModal}>
                                <Ionicons name="add-circle" size={24} color="black" style={styles.icon} />
                                <Text style={styles.text}>Creează eveniment</Text>
                            </TouchableOpacity>
                        )}
                        {Object.keys(group.events).length > 0 ? (
                            <Text>Evenimente:</Text>
                        ) : (
                            <Text>Nu există evenimente</Text>
                        )}
                        <View>
                            {groupCopy.events.map(event => (
                                <EventItem key={event.id} groupEvent={event} onChangeGroupEvent={handleGroupEventChange} />
                            ))}
                        </View>
                    </View>
                    </ScrollView>
                </SafeAreaView>
           
            <MembersModal
                visible={isMembersModalVisible}
                onClose={handleCloseMembersModal}
                members={groupCopy.members}
            />
            <CreateEventModal
                visible={isCreateEventModalVisible}
                onClose={handleCloseCreateEventModal}
                groupId={group.id}
            />
            <GroupFeedbackModal
                visible={isGroupFeedbackModalVisible}
                onClose={handleCloseGroupFeedbackModal}
                groupName={group.name}
                groupId={group.id}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 20 : 0,
        backgroundColor: "#f0f0f0f0",
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    background: {
        position: 'relative',
        width: '100%',
        height: 300,
        marginBottom: 20,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    groupCreation: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    overlay: {
        position: 'absolute',
        bottom: -20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        left: 20,
        right: 20,
        backgroundColor: '#427D9D',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    firstText: {
        color: 'white',
        fontSize: 22,
    },
    secondText: {
        fontSize: 14,
        color: 'white',
        fontStyle: 'italic'
    },
    closeButtonContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 160, // Ajustează lățimea pentru a face loc pentru noul buton
    },
    closeButton: {},
    leaveButton: {
        opacity: 1,
    },
    membersButton: {
        opacity: 1,
    },
    feedbackButton: {
        opacity: 1,
    },
    createEventButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    icon: {
        marginRight: 5,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GroupDetailsModal;
