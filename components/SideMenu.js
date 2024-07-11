import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditProfileModal from './EditProfileModal';
import ConversationsModal from './ConversationsModal';
import ProfileModal from './ProfileModal';
import AvailableEventsModal from './AvailableEventsModal';
import MyEventsModal from './MyEventsModal';
import PlayerAvailabilityModal from './PlayerAvailabilityModal';
import AdminPageModal from './AdminPageModal';
import ComplaintModal from './ComplaintModal';
import CompareStatsModal from './CompareStatsModal';
import { useUser } from '../context/UserContext';

const SideMenu = ({ isVisible, onClose }) => {
    const { userData, updateUserData } = useUser();
    const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
    const [isConversationsModalVisible, setIsConversationsModalVisible] = useState(false);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [isAvailableEventsModalVisible, setIsAvailableEventsModalVisible] = useState(false);
    const [isMyEventsModalVisible, setIsMyEventsModalVisible] = useState(false);
    const [isPlayerAvailabilityModalVisible, setIsPlayerAvailabilityModalVisible] = useState(false);
    const [isAdminPageModalVisible, setIsAdminPageModalVisible] = useState(false);
    const [isComplaintModalVisible, setIsComplaintModalVisible] = useState(false);
    const [isCompareStatsModalVisible, setIsCompareStatsModalVisible] = useState(false);

    useEffect(() => {
        if(userData){
            console.log(userData)
        }
    }, []);

    const openEditProfileModal = () => {
        setIsEditProfileModalVisible(true);
    };

    const closeEditProfileModal = () => {
        setIsEditProfileModalVisible(false);
    };

    const openConversationsModal = () => {
        setIsConversationsModalVisible(true);
    };

    const closeConversationsModal = () => {
        setIsConversationsModalVisible(false);
    };

    const openProfileModal = () => {
        setIsProfileModalVisible(true);
    };

    const closeProfileModal = () => {
        setIsProfileModalVisible(false);
    };

    const openAvailableEventsModal = () => {
        setIsAvailableEventsModalVisible(true);
    };

    const closeAvailableEventsModal = () => {
        setIsAvailableEventsModalVisible(false);
    };

    const openMyEventsModal = () => {
        setIsMyEventsModalVisible(true);
    };

    const closeMyEventsModal = () => {
        setIsMyEventsModalVisible(false);
    };

    const openPlayerAvailabilityModal = () => {
        setIsPlayerAvailabilityModalVisible(true);
    };

    const closePlayerAvailabilityModal = () => {
        setIsPlayerAvailabilityModalVisible(false);
    };

    const openAdminPageModal = () => {
        setIsAdminPageModalVisible(true);
    };

    const closeAdminPageModal = () => {
        setIsAdminPageModalVisible(false);
    };

    const openComplaintModal = () => {
        setIsComplaintModalVisible(true);
    };

    const closeComplaintModal = () => {
        setIsComplaintModalVisible(false);
    };

    const openCompareStatsModal = () => {
        setIsCompareStatsModalVisible(true);
    };

    const closeCompareStatsModal = () => {
        setIsCompareStatsModalVisible(false);
    };

    return (
        <View style={[styles.mainContainer, { opacity: isVisible ? 1 : 0, zIndex: isVisible ? 1000 : -1 }]}>
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.container}>
                    <TouchableOpacity style={[styles.menuItem, styles.firstItem]} onPress={openProfileModal}>
                        <Text style={styles.menuText}>Profil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={openEditProfileModal}>
                        <Text style={styles.menuText}>Editare profil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={openConversationsModal}>
                        <Text style={styles.menuText}>Conversatii</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={openCompareStatsModal}>
                        <Text style={styles.menuText}>Compara statistici</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={openAvailableEventsModal}>
                        <Text style={styles.menuText}>Evenimente disponibile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={openMyEventsModal}>
                        <Text style={styles.menuText}>Evenimentele mele</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={openPlayerAvailabilityModal}>
                        <Text style={styles.menuText}>Disponibilitate jucători</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={openComplaintModal}>
                        <Text style={styles.menuText}>Scrie reclamație</Text>
                    </TouchableOpacity>
                    {userData && userData.admin && (
                        <TouchableOpacity style={styles.menuItem} onPress={openAdminPageModal}>
                            <Text style={styles.menuText}>Admin page</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    <ProfileModal visible={isProfileModalVisible} onClose={closeProfileModal} userId={userData ? userData.id : null} />
                    <EditProfileModal visible={isEditProfileModalVisible} onClose={closeEditProfileModal} />
                    <ConversationsModal visible={isConversationsModalVisible} onClose={closeConversationsModal} />
                    <AvailableEventsModal visible={isAvailableEventsModalVisible} onClose={closeAvailableEventsModal} />
                    <MyEventsModal visible={isMyEventsModalVisible} onClose={closeMyEventsModal} />
                    <PlayerAvailabilityModal visible={isPlayerAvailabilityModalVisible} onClose={closePlayerAvailabilityModal} />
                    <AdminPageModal visible={isAdminPageModalVisible} onClose={closeAdminPageModal} />
                    <ComplaintModal visible={isComplaintModalVisible} onClose={closeComplaintModal} />
                    <CompareStatsModal visible={isCompareStatsModalVisible} onClose={closeCompareStatsModal} />
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: '90%',
    },
    container: {
        padding: 10,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        zIndex: 1000,
    },
    closeButton: {
        alignSelf: 'center',
        padding: 10,
        marginBottom: 80,
        marginTop: 'auto',
        backgroundColor: 'lightgray',
        borderRadius: 5,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    firstItem: {
        marginTop: 40,
        borderTopWidth: 1,
        borderTopColor: 'gray',
    },
    menuItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    menuText: {
        fontSize: 16,
    },
});

export default SideMenu;
