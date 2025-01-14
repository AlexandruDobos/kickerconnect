// GroupsPage.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import TopBar from '../components/TopBar';
import GroupsList from '../components/GroupsList';
import GroupDetailsModal from '../components/GroupDetailsModal';
import { useUser } from '../context/UserContext'
import { ip, port } from '../core/utils';
import BottomBar from '../components/BottomBar';
import { useEvent } from '../context/EventContext';

function GroupsPage() {
    const [selected, setSelected] = useState('Grupuri publice');
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const { userData, updateUserData } = useUser();
    const { eventData, updateEventData } = useEvent();
    const [event, setEvent] = useState(null); // Starea pentru eveniment
    const [searchText, setSearchText] = useState('');
    const handleSelectGroup = (groupsData) => {
        setGroups(groupsData);
        //console.log(groupsData[0].events)
    };

    const handleGroupDetails = (group) => {
        setSelectedGroup(group);
        if (group.events && group.events.length > 0) {
            // Setează evenimentul la primul eveniment din grup
            setEvent(group.events[0]);
            updateEventData(group.events[0])
        }
    };

    const handleCloseModal = () => {
        setSelectedGroup(null);
    };

    const handleSubmit = (value) => {


        const fetchUrl = "http://" + ip + ":" + port + "/group/getAll"
        fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                let groups = [];
                data.forEach(group => {
                    const isGood = group.name.toLowerCase().includes(value.toLowerCase());
                    if (isGood) {
                        groups.push(group);
                    }
                });
                setGroups(groups);
            })
            .catch(error => console.log("Error selecting groups: " + error));
    }
    const handleJoin = () => {

        const userId = { id: userData.id };
        let groupMembers = selectedGroup.members;
        const idExists = groupMembers.some(object => object.id === userData.id);
        if (!idExists) {
            groupMembers = groupMembers.concat(userId);
            const fetchUrl = "http://" + ip + ":" + port + "/group?group=" + selectedGroup.id;
            fetch(fetchUrl, {

                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    members: groupMembers
                }),
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (data.errorMessage) {
                    } else {
                        setSelectedGroup(prevGroup => ({
                            ...prevGroup,
                            members: groupMembers
                        }));
                    }
                })
                .catch((error) => {
                    console.error('Error adding user:', error);
                });

        } else {
            console.log("Userul este deja inscris in grup")

        }
    };

    return (

        <View style={styles.mainContainer}>

            <TopBar selected={selected} onSelect={setSelected} onSelectGroup={handleSelectGroup} />
            {selected === 'Căutare' && (
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="Introduceți termenul de căutare"
                        value={searchText}
                        onChangeText={(value) => { setSearchText(value); handleSubmit(value) }}
                    />
                </View>
            )}
            <ScrollView style={styles.scrollView}>
                <GroupsList groups={groups} selected={selected} onGroupDetails={handleGroupDetails} />
                {selectedGroup && (
                    <GroupDetailsModal key={selectedGroup.id} group={selectedGroup} onClose={handleCloseModal} onJoin={handleJoin} />
                )}
            </ScrollView>
            <BottomBar />
        </View>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    scrollView:{
        flex:1
    },
    container: {
        width: "100%",
        alignSelf: "center",
        display: "flex",
        alignItems: "center"
    },
    input: {
        width: "80%",
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
})
export default GroupsPage;
