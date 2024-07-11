import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ip, port } from '../core/utils';
import { useUser } from '../context/UserContext';

const AdminPageModal = ({ visible, onClose, userId, username }) => {
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
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [isUsersModalVisible, setIsUsersModalVisible] = useState(false);
    const [isGroupsModalVisible, setIsGroupsModalVisible] = useState(false);
    const [isComplaintsModalVisible, setIsComplaintsModalVisible] = useState(false);

    useEffect(() => {
        if (userId) {
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
        }
    }, [visible, userId]);

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

    const fetchAllUsers = () => {
        const fetchUrl = `http://${ip}:${port}/user/getAll`;

        fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const usersWithEmail = data.filter(user => user.email && user.active);
                setUsers(usersWithEmail);
                setIsUsersModalVisible(true);
            })
            .catch((error) => {
                console.error('Error fetching all users:', error);
            });
    };

    const deactivateUser = (userId) => {
        const deleteUrl = `http://${ip}:${port}/user?user=${userId}`;

        fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.errorMessage) {
                    setUsers(prevUsers => prevUsers.map(user =>
                        user.id === userId ? { ...user, active: false } : user
                    ));
                }
            })
            .catch((error) => {
                console.error('Error deactivating user:', error);
            });
    };

    const activateUser = (userId) => {
        const patchUrl = `http://${ip}:${port}/user/activate?user=${userId}`;

        fetch(patchUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.errorMessage) {
                    setUsers(prevUsers => prevUsers.map(user =>
                        user.id === userId ? { ...user, active: true } : user
                    ));
                }
            })
            .catch((error) => {
                console.error('Error activating user:', error);
            });
    };

    const handleLockToggle = (userId, isActive) => {
        if (isActive) {
            deactivateUser(userId);
        } else {
            activateUser(userId);
        }
    };

    const fetchAllGroups = () => {
        const fetchUrl = `http://${ip}:${port}/group/getAll`;

        fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setGroups(data);  // Load all groups
                setIsGroupsModalVisible(true);
            })
            .catch((error) => {
                console.error('Error fetching all groups:', error);
            });
    };

    const refreshGroups = () => {
        const fetchUrl = `http://${ip}:${port}/group/getAll`;

        fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setGroups(data);  // Reload all groups
                if (selectedGroup) {
                    const updatedGroup = data.find(group => group.id === selectedGroup.id);
                    setSelectedGroup(updatedGroup);
                }
            })
            .catch((error) => {
                console.error('Error fetching all groups:', error);
            });
    };

    const deactivateGroup = (groupId) => {
        const deleteUrl = `http://${ip}:${port}/group?group=${groupId}`;

        fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.errorMessage) {
                    setGroups(prevGroups => prevGroups.map(group =>
                        group.id === groupId ? { ...group, active: false } : group
                    ));
                }
            })
            .catch((error) => {
                console.error('Error deactivating group:', error);
            });
    };

    const activateGroup = (groupId) => {
        const patchUrl = `http://${ip}:${port}/group/activate?group=${groupId}`;

        fetch(patchUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.errorMessage) {
                    setGroups(prevGroups => prevGroups.map(group =>
                        group.id === groupId ? { ...group, active: true } : group
                    ));
                }
            })
            .catch((error) => {
                console.error('Error activating group:', error);
            });
    };

    const handleGroupLockToggle = (groupId, isActive) => {
        if (isActive) {
            deactivateGroup(groupId);
        } else {
            activateGroup(groupId);
        }
    };

    const selectGroup = (group) => {
        setSelectedGroup(group.id === selectedGroup?.id ? null : group);
    };

    const deactivateEvent = (eventId) => {
        const deleteUrl = `http://${ip}:${port}/event?event=${eventId}`;

        fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.errorMessage) {
                    refreshGroups();
                }
            })
            .catch((error) => {
                console.error('Error deactivating event:', error);
            });
    };

    const activateEvent = (eventId) => {
        const patchUrl = `http://${ip}:${port}/event/activate?event=${eventId}`;

        fetch(patchUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.errorMessage) {
                    refreshGroups();
                }
            })
            .catch((error) => {
                console.error('Error activating event:', error);
            });
    };

    const handleEventLockToggle = (eventId, isActive) => {
        if (isActive) {
            deactivateEvent(eventId);
        } else {
            activateEvent(eventId);
        }
    };

    const fetchAllComplaints = () => {
        const fetchUrl = `http://${ip}:${port}/complaint/getAll`;

        fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setComplaints(data);
                setIsComplaintsModalVisible(true);
            })
            .catch((error) => {
                console.error('Error fetching complaints:', error);
            });
    };

    const resolveComplaint = (complaintId) => {
        const patchUrl = `http://${ip}:${port}/complaint?complaint=${complaintId}`;

        fetch(patchUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.errorMessage) {
                    setComplaints(prevComplaints => prevComplaints.map(complaint =>
                        complaint.id === complaintId ? { ...complaint, resolved: true, resolvedTime: new Date().toISOString() } : complaint
                    ));
                }
            })
            .catch((error) => {
                console.error('Error resolving complaint:', error);
            });
    };

    const closeUsersModal = () => {
        setIsUsersModalVisible(false);
    };

    const closeGroupsModal = () => {
        setIsGroupsModalVisible(false);
        setSelectedGroup(null);
    };

    const closeComplaintsModal = () => {
        setIsComplaintsModalVisible(false);
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
                    <Text style={styles.text}>Pagină administrator</Text>
                    <TouchableOpacity style={styles.button} onPress={fetchAllUsers}>
                        <Text style={styles.buttonText}>Blocheaza/deblocheaza utilizatori</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={fetchAllGroups}>
                        <Text style={styles.buttonText}>Blocheaza/deblocheaza grupuri si evenimente</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={fetchAllComplaints}>
                        <Text style={styles.buttonText}>Vezi reclamații</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={false}
                visible={isUsersModalVisible}
                onRequestClose={closeUsersModal}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeUsersModal}>
                        <Ionicons name="close-circle" size={36} color="black" />
                    </TouchableOpacity>
                    <View style={styles.content}>
                        <Text style={styles.text}>Lista utilizatorilor</Text>
                        {users.map(user => (
                            <View key={user.id} style={styles.userCard}>
                                <View style={styles.groupHeader}>
                                    <Text>{user.name} ({user.username})</Text>
                                    <TouchableOpacity onPress={() => handleLockToggle(user.id, user.active)}>
                                        <Ionicons
                                            name={user.active ? "lock-closed" : "lock-open"}
                                            size={24}
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </Modal>
            <Modal
                animationType="slide"
                transparent={false}
                visible={isGroupsModalVisible}
                onRequestClose={closeGroupsModal}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeGroupsModal}>
                        <Ionicons name="close-circle" size={36} color="black" />
                    </TouchableOpacity>
                    <View style={styles.content}>
                        <Text style={styles.text}>Lista grupurilor</Text>
                        {groups.map(group => (
                            <View key={group.id} style={styles.userCard}>
                                <View style={styles.groupHeader}>
                                    <TouchableOpacity onPress={() => selectGroup(group)}>
                                        <Text>{group.name}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleGroupLockToggle(group.id, group.active)}>
                                        <Ionicons
                                            name={group.active ? "lock-closed" : "lock-open"}
                                            size={24}
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {selectedGroup?.id === group.id && group.events && (
                                    <View style={styles.eventList}>
                                        {group.events.map(event => (
                                            <View key={event.id} style={styles.eventCard}>
                                                <Text>{event.name}</Text>
                                                <TouchableOpacity onPress={() => handleEventLockToggle(event.id, event.active)}>
                                                    <Ionicons
                                                        name={event.active ? "lock-closed" : "lock-open"}
                                                        size={20}
                                                        color="black"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </Modal>
            <Modal
                animationType="slide"
                transparent={false}
                visible={isComplaintsModalVisible}
                onRequestClose={closeComplaintsModal}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={closeComplaintsModal}>
                        <Ionicons name="close-circle" size={36} color="black" />
                    </TouchableOpacity>
                    <View style={styles.content}>
                        <Text style={styles.text}>Lista reclamațiilor</Text>
                        {complaints.map(complaint => (
                            <View key={complaint.id} style={styles.userCard}>
                                <Text style={styles.usernameStyle}>{complaint.creator}</Text>
                                <View style={styles.groupHeader}>

                                    <Text style={styles.complaintContentStyle}>{complaint.content}</Text>
                                    <TouchableOpacity onPress={() => resolveComplaint(complaint.id)}>
                                        <Ionicons
                                            name={complaint.resolved ? "checkmark-circle" : "alert-circle"}
                                            size={24}
                                            color={complaint.resolved ? "green" : "red"}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text>Creat: {new Date(complaint.launchedTime).toLocaleString()}</Text>
                                {complaint.resolved && (
                                    <Text style={styles.resolvedStyle}>Rezolvat: {new Date(complaint.resolvedTime).toLocaleString()}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </Modal>
        </Modal>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: "#f0f0f0",
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
    text: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 40,
        color: '#333333',
        fontWeight: "bold",
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
    userCard: {
        width: '90%',
        padding: 10,
        marginVertical: 10,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eventList: {
        paddingLeft: 20,
    },
    eventCard: {
        width: '90%',
        padding: 5,
        marginVertical: 5,
        backgroundColor: 'lightgray',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    usernameStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333333',
    },
    complaintContentStyle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333333',
    },
    resolvedStyle: {
        color: 'green',
    },
});

export default AdminPageModal;
